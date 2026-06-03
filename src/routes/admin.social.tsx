import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Send, Sparkles, KeyRound, Save, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  saveCredential,
  getCredentialStatus,
  adaptForPlatform,
  publishToSocial,
} from "@/lib/social.functions";

export const Route = createFileRoute("/admin/social")({
  component: SocialPage,
});

type Platform = "linkedin" | "facebook";
type CredKey = "linkedin_token" | "linkedin_author_urn" | "facebook_page_id" | "facebook_page_token";
const CRED_KEYS: CredKey[] = [
  "linkedin_token",
  "linkedin_author_urn",
  "facebook_page_id",
  "facebook_page_token",
];
const CRED_LABELS: Record<CredKey, string> = {
  linkedin_token: "Jeton d'accès LinkedIn",
  linkedin_author_urn: "URN auteur LinkedIn (urn:li:person:…)",
  facebook_page_id: "ID Page Facebook",
  facebook_page_token: "Jeton Page Facebook",
};

type Post = { id: string; platform: string; content: string; post_url: string | null; status: string; error: string | null; created_at: string };

function SocialPage() {
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [adapting, setAdapting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [credValues, setCredValues] = useState<Record<string, string>>({});
  const [credStatus, setCredStatus] = useState<Record<string, boolean>>({});
  const [savingCred, setSavingCred] = useState<string | null>(null);
  const [history, setHistory] = useState<Post[]>([]);

  const callAdapt = useServerFn(adaptForPlatform);
  const callPublish = useServerFn(publishToSocial);
  const callSaveCred = useServerFn(saveCredential);
  const callGetStatus = useServerFn(getCredentialStatus);

  const loadAll = async () => {
    const [s, h] = await Promise.all([
      callGetStatus({ data: { keys: CRED_KEYS } }),
      supabase
        .from("social_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    if (s.success) {
      const map: Record<string, boolean> = {};
      s.status.forEach((it) => (map[it.key] = it.configured));
      setCredStatus(map);
    }
    setHistory((h.data as Post[]) ?? []);
  };
  useEffect(() => {
    loadAll();
  }, []);

  const saveCred = async (key: CredKey) => {
    const value = credValues[key] ?? "";
    if (!value.trim()) return toast.error("Valeur requise");
    setSavingCred(key);
    const res = await callSaveCred({ data: { key, value } });
    setSavingCred(null);
    if (res.success) {
      toast.success("Enregistré");
      setCredValues((p) => ({ ...p, [key]: "" }));
      setCredStatus((p) => ({ ...p, [key]: true }));
    } else {
      toast.error(res.error);
    }
  };

  const adapt = async () => {
    if (!source.trim() || source.trim().length < 10) return toast.error("Source trop courte");
    setAdapting(true);
    const res = await callAdapt({ data: { platform, source } });
    setAdapting(false);
    if (res.success) {
      setContent(res.content);
      toast.success("Contenu adapté");
    } else {
      toast.error(res.error);
    }
  };

  const publish = async () => {
    if (!content.trim()) return toast.error("Contenu vide");
    if (!confirm(`Publier sur ${platform === "linkedin" ? "LinkedIn" : "Facebook"} ?`)) return;
    setPublishing(true);
    const res = await callPublish({ data: { platform, content } });
    setPublishing(false);
    if (res.success) {
      toast.success("Publié");
      setContent("");
      loadAll();
    } else {
      toast.error(res.error);
      loadAll();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-1 inline-flex items-center gap-2 text-base font-bold">
          <KeyRound className="h-5 w-5 text-primary" /> Connexions
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Les jetons sont stockés côté serveur et ne sont jamais exposés au navigateur.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {CRED_KEYS.map((k) => (
            <div key={k} className="rounded-lg border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold">
                <span>{CRED_LABELS[k]}</span>
                {credStatus[k] ? (
                  <span className="inline-flex items-center gap-1 text-secondary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Configuré
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <XCircle className="h-3.5 w-3.5" /> Non configuré
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={credValues[k] ?? ""}
                  onChange={(e) => setCredValues((p) => ({ ...p, [k]: e.target.value }))}
                  placeholder="Coller la nouvelle valeur…"
                  className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => saveCred(k)}
                  disabled={savingCred === k}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
                >
                  {savingCred === k ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-base font-bold">Composer une publication</h2>
        <div className="mb-4 inline-flex rounded-lg border border-border bg-background p-1">
          {(["linkedin", "facebook"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold capitalize ${
                platform === p ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-sm font-semibold">Idée / source</label>
        <textarea
          rows={3}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Décrivez le sujet, collez un extrait d'article ou un message brut…"
          className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={adapt}
          disabled={adapting}
          className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-60"
        >
          {adapting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Adapter par IA pour {platform}
        </button>

        <label className="mb-1 block text-sm font-semibold">Contenu à publier</label>
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Le texte final à publier sur le réseau."
          className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{content.length} caractères</span>
          <button
            onClick={publish}
            disabled={publishing || !content.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publier
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-bold">Historique</div>
        {history.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Aucune publication enregistrée.</p>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((h) => (
              <li key={h.id} className="p-4">
                <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold capitalize">{h.platform}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${
                      h.status === "published" ? "bg-secondary/15 text-secondary" : "bg-red-500/15 text-red-500"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-foreground">{h.content}</p>
                {h.error && <p className="mt-1 text-xs text-red-500">{h.error}</p>}
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(h.created_at).toLocaleString("fr-FR")}</span>
                  {h.post_url && (
                    <a href={h.post_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      Voir <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}