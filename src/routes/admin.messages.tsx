import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, Inbox, Trash2, MessageCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "@/lib/dateUtils";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesInbox,
});

type Msg = {
  id: string;
  full_name: string;
  organization: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  budget: string | null;
  message: string;
  status: string;
  replied: boolean;
  created_at: string;
};

const TABS = [
  { key: "all", label: "Tous" },
  { key: "unread", label: "Non lus" },
  { key: "read", label: "Lus" },
  { key: "replied", label: "Répondus" },
] as const;

function MessagesInbox() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [selected, setSelected] = useState<Msg | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setRows((data as Msg[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = rows.filter((m) => {
    if (tab === "unread" && m.status !== "unread") return false;
    if (tab === "read" && m.status !== "read") return false;
    if (tab === "replied" && !m.replied) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.full_name.toLowerCase().includes(q) || (m.subject ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  const open = async (m: Msg) => {
    setSelected(m);
    if (m.status === "unread") {
      await supabase.from("contact_messages").update({ status: "read" }).eq("id", m.id);
      setRows((prev) => prev.map((p) => (p.id === m.id ? { ...p, status: "read" } : p)));
    }
  };

  const markReplied = async (m: Msg) => {
    await supabase.from("contact_messages").update({ replied: true, status: "replied" }).eq("id", m.id);
    toast.success("Marqué comme répondu");
    setRows((prev) => prev.map((p) => (p.id === m.id ? { ...p, replied: true, status: "replied" } : p)));
    setSelected({ ...m, replied: true, status: "replied" });
  };

  const remove = async (m: Msg) => {
    if (!confirm("Supprimer ce message ?")) return;
    await supabase.from("contact_messages").delete().eq("id", m.id);
    toast.success("Message supprimé");
    setSelected(null);
    load();
  };

  return (
    <div className="grid h-[calc(100vh-9rem)] gap-4 lg:grid-cols-[380px_1fr]">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          <div className="mt-2 flex gap-1">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-40" />
              Aucun message
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((m) => (
                <li key={m.id}>
                  <button onClick={() => open(m)} className={`w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${selected?.id === m.id ? "bg-muted" : ""}`}>
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.replied ? "bg-secondary" : m.status === "unread" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-sm font-bold text-foreground">{m.full_name}</div>
                          <span className="text-xs text-muted-foreground">{formatDistanceToNow(m.created_at)}</span>
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{m.organization ?? "—"}</div>
                        <div className="mt-1 truncate text-xs text-foreground/70">{m.subject ?? "Sans objet"}</div>
                        {m.budget && <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{m.budget}</span>}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {!selected ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <Mail className="h-10 w-10 opacity-30" />
            <p className="text-sm">Sélectionnez un message pour le consulter.</p>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selected.full_name}</h2>
                  <div className="text-sm text-muted-foreground">{selected.organization ?? "—"}</div>
                </div>
                <button onClick={() => remove(selected)} className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
              <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                <Detail label="Objet" value={selected.subject ?? "—"} />
                <Detail label="Budget" value={selected.budget ?? "—"} />
                <Detail label="Email" value={selected.email ?? "—"} />
                <Detail label="Téléphone" value={selected.phone ?? "—"} />
                <Detail label="Date" value={new Date(selected.created_at).toLocaleString("fr-FR")} />
              </dl>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">{selected.message}</p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 p-4">
              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject ?? "Votre message"} — Flaugust Business`)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
                >
                  <Mail className="h-4 w-4" /> Répondre par email
                </a>
              )}
              {selected.phone && (
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour ${selected.full_name}, suite à votre message…`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
              {!selected.replied && (
                <button onClick={() => markReplied(selected)} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
                  <CheckCircle2 className="h-4 w-4" /> Marquer comme répondu
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
