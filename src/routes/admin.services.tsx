import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/services")({
  component: ServicesManager,
});

type Row = {
  id: string;
  slug: string;
  title: string;
  badge: string | null;
  color: string | null;
  published: boolean;
  sort_order: number;
};

function ServicesManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("id,slug,title,badge,color,published,sort_order").order("sort_order");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (r: Row) => {
    await supabase.from("services").update({ published: !r.published }).eq("id", r.id);
    toast.success(r.published ? "Service masqué" : "Service publié");
    load();
  };

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">{rows.length} service(s) — gérez l'affichage et l'ordre.</p>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Publié</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{r.sort_order}</td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: r.color ?? "#7B3415" }} />
                    {r.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.badge ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(r)}>
                      {r.published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-1 text-xs font-bold text-secondary"><Eye className="h-3 w-3" /> Publié</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-bold text-muted-foreground"><EyeOff className="h-3 w-3" /> Caché</span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && <ServiceEdit row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ServiceEdit({ row, onClose, onSaved }: { row: Row; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(row.title);
  const [badge, setBadge] = useState(row.badge ?? "");
  const [sortOrder, setSortOrder] = useState(row.sort_order);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("services").update({ title, badge, sort_order: sortOrder }).eq("id", row.id);
    setSaving(false);
    if (error) return toast.error("Erreur");
    toast.success("Service enregistré");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-bold">Modifier le service</h2>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Titre</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Badge</span>
            <input value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Ordre</span>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">Annuler</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
