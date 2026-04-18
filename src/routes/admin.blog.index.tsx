import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/dateUtils";

export const Route = createFileRoute("/admin/blog/")({
  component: BlogManager,
});

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  published: boolean;
  views: number;
  updated_at: string;
};

function BlogManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("posts").select("id,slug,title,category,published,views,updated_at").order("updated_at", { ascending: false });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (r: Row) => {
    if (!confirm(`Supprimer "${r.title}" ?`)) return;
    await supabase.from("posts").delete().eq("id", r.id);
    toast.success("Article supprimé");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} article(s)</p>
        <Link to="/admin/blog/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Aucun article. <Link to="/admin/blog/new" className="text-primary hover:underline">Créer le premier</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Vues</th>
                <th className="px-4 py-3">Mis à jour</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.published ? (
                      <span className="rounded-full bg-secondary/15 px-2 py-1 text-xs font-bold text-secondary">Publié</span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">Brouillon</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.views}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.updated_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/admin/blog/$id" params={{ id: r.id }} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => remove(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
