import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsManager,
});

type Row = {
  id: string;
  name: string;
  org: string | null;
  country: string | null;
  text: string;
  rating: number;
  avatar: string | null;
  color: string | null;
  published: boolean;
  sort_order: number;
};

const empty: Omit<Row, "id"> = {
  name: "",
  org: "",
  country: "",
  text: "",
  rating: 5,
  avatar: "",
  color: "#7B3415",
  published: true,
  sort_order: 0,
};

function TestimonialsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (r: Row) => {
    if (!confirm(`Supprimer le témoignage de ${r.name} ?`)) return;
    await supabase.from("testimonials").delete().eq("id", r.id);
    toast.success("Témoignage supprimé");
    load();
  };

  const togglePublished = async (r: Row) => {
    await supabase.from("testimonials").update({ published: !r.published }).eq("id", r.id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} témoignage(s)</p>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Ajouter un témoignage
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: r.color ?? "#7B3415" }}>
                    {r.avatar ?? r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.org}</div>
                  </div>
                </div>
                <button onClick={() => togglePublished(r)} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.published ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>
                  {r.published ? "Publié" : "Caché"}
                </button>
              </div>
              <div className="mt-2 flex">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />)}
              </div>
              <p className="mt-3 line-clamp-3 text-sm italic text-foreground/80">"{r.text}"</p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setEditing(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <TestimonialForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function TestimonialForm({ initial, onClose, onSaved }: { initial: Row | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

  const save = async () => {
    if (!form.name.trim() || !form.text.trim()) return toast.error("Nom et témoignage requis");
    setSaving(true);
    const payload = { ...form, avatar: form.avatar || form.name.charAt(0).toUpperCase() };
    const { error } = initial
      ? await supabase.from("testimonials").update(payload).eq("id", initial.id)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (error) return toast.error("Erreur");
    toast.success("Témoignage enregistré");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">{initial ? "Modifier" : "Nouveau témoignage"}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          <Field label="Nom *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Organisation"><input value={form.org ?? ""} onChange={(e) => setForm({ ...form, org: e.target.value })} className={inputCls} /></Field>
          <Field label="Pays / Ville"><input value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} /></Field>
          <Field label="Témoignage *"><textarea rows={5} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={inputCls} /></Field>
          <Field label="Note">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                  <Star className={`h-6 w-6 ${n <= form.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Initiale"><input value={form.avatar ?? ""} maxLength={2} onChange={(e) => setForm({ ...form, avatar: e.target.value.toUpperCase() })} className={inputCls} /></Field>
            <Field label="Couleur"><input type="color" value={form.color ?? "#7B3415"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-full rounded-lg border border-border" /></Field>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /><span className="text-sm font-semibold">Publié</span></label>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border bg-card px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">Annuler</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
