import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export const Route = createFileRoute("/admin/portfolio")({
  component: PortfolioManager,
});

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

function PortfolioManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio")
      .select("id,slug,title,category,client,image_url,published,sort_order")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Erreur de chargement");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublished = async (row: Row) => {
    const { error } = await supabase
      .from("portfolio")
      .update({ published: !row.published })
      .eq("id", row.id);
    if (error) return toast.error("Erreur");
    toast.success(row.published ? "Projet masqué" : "Projet publié");
    load();
  };

  const remove = async (row: Row) => {
    if (!confirm(`Supprimer "${row.title}" ? Cette action est irréversible.`)) return;
    const { error } = await supabase.from("portfolio").delete().eq("id", row.id);
    if (error) return toast.error("Erreur de suppression");
    toast.success("Projet supprimé");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} projet(s)</p>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Nouveau projet
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Publié</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded bg-muted">
                      {r.image_url ? (
                        <img src={r.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.client ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublished(r)} className="inline-flex items-center gap-1 text-xs">
                      {r.published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-1 font-bold text-secondary">
                          <Eye className="h-3 w-3" /> Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-bold text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> Caché
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(r.id)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Aucun projet. <Link to="/admin/portfolio" className="text-primary hover:underline" onClick={() => setEditing("new")}>Créer le premier</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <PortfolioForm
          id={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
