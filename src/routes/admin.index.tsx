import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderOpen, Mail, FileText, Grid, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { dailyBriefing } from "@/lib/ai.functions";

export const Route = createFileRoute("/admin/")({
  component: DashboardHome,
});

type Counts = { portfolio: number; unread: number; posts: number; services: number };
type RecentMsg = { id: string; full_name: string; subject: string | null; status: string; created_at: string };
type RecentPost = { id: string; title: string; published: boolean; updated_at: string };

function DashboardHome() {
  const [counts, setCounts] = useState<Counts>({ portfolio: 0, unread: 0, posts: 0, services: 0 });
  const [recentMessages, setRecentMessages] = useState<RecentMsg[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [actualitesCount, setActualitesCount] = useState(0);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const callBriefing = useServerFn(dailyBriefing);

  useEffect(() => {
    (async () => {
      const [p, m, b, s, a, rm, rp] = await Promise.all([
        supabase.from("portfolio").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("actualites").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("contact_messages").select("id,full_name,subject,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("posts").select("id,title,published,updated_at").order("updated_at", { ascending: false }).limit(5),
      ]);
      setCounts({
        portfolio: p.count ?? 0,
        unread: m.count ?? 0,
        posts: b.count ?? 0,
        services: s.count ?? 0,
      });
      setActualitesCount(a.count ?? 0);
      setRecentMessages(rm.data ?? []);
      setRecentPosts(rp.data ?? []);
    })();
  }, []);

  const loadBriefing = async () => {
    setBriefingLoading(true);
    setBriefingError(null);
    try {
      const res = await callBriefing({
        data: {
          unreadMessages: counts.unread,
          publishedPosts: counts.posts,
          publishedProjects: counts.portfolio,
          publishedActualites: actualitesCount,
          recentTitles: recentPosts.map((p) => p.title).slice(0, 5),
        },
      });
      if (res.success) setBriefing(res.summary);
      else setBriefingError(res.error);
    } catch (e) {
      setBriefingError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBriefingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" /> Résumé IA du jour
          </h2>
          <button
            onClick={loadBriefing}
            disabled={briefingLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-60"
          >
            {briefingLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {briefing ? "Régénérer" : "Générer"}
          </button>
        </div>
        {briefing ? (
          <p className="text-sm leading-relaxed text-foreground">{briefing}</p>
        ) : briefingError ? (
          <p className="text-sm text-red-500">{briefingError}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Cliquez sur « Générer » pour obtenir un résumé exécutif de votre activité du jour.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI title="Projets publiés" value={counts.portfolio} icon={<FolderOpen className="h-5 w-5" />} color="#7B3415" link="/admin/portfolio" linkLabel="Voir le portfolio" />
        <KPI title="Messages non lus" value={counts.unread} icon={<Mail className="h-5 w-5" />} color="#E88930" link="/admin/messages" linkLabel="Voir les messages" pulse={counts.unread > 0} />
        <KPI title="Articles publiés" value={counts.posts} icon={<FileText className="h-5 w-5" />} color="#1A6B35" link="/admin/blog" linkLabel="Voir le blog" />
        <KPI title="Services actifs" value={counts.services} icon={<Grid className="h-5 w-5" />} color="#B83080" link="/admin/services" linkLabel="Voir les services" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-bold text-foreground">Derniers messages</h2>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-foreground">{m.full_name}</div>
                    <div className="truncate text-xs text-muted-foreground">{m.subject ?? "Sans objet"}</div>
                  </div>
                  <div className="ml-3 flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.status === "unread" ? "bg-accent/15 text-accent" : m.status === "replied" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>
                      {m.status === "unread" ? "Nouveau" : m.status === "replied" ? "Répondu" : "Lu"}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(m.created_at)}</span>
                    <Link to="/admin/messages" className="text-xs font-semibold text-primary hover:underline">Lire →</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-bold text-foreground">Derniers articles</h2>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun article pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0 flex-1 truncate font-semibold text-foreground">{p.title}</div>
                  <div className="ml-3 flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.published ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>
                      {p.published ? "Publié" : "Brouillon"}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(p.updated_at)}</span>
                    <Link to="/admin/blog" className="text-xs font-semibold text-primary hover:underline">Éditer →</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value, icon, color, link, linkLabel, pulse }: { title: string; value: number; icon: React.ReactNode; color: string; link: string; linkLabel: string; pulse?: boolean }) {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-5">
      {pulse && <span className="absolute right-4 top-4 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-red-500/30" />}
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`, color }}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{title}</div>
      <Link to={link} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
        {linkLabel} →
      </Link>
    </div>
  );
}
