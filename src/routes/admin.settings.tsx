import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Row = { key: string; value: string | null; updated_at: string };

function SettingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").order("key");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (r: Row) => {
    setSavingKey(r.key);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: r.key, value: r.value, updated_at: new Date().toISOString() });
    setSavingKey(null);
    if (error) toast.error(error.message);
    else toast.success("Enregistré");
  };

  const remove = async (key: string) => {
    if (!confirm(`Supprimer le paramètre « ${key} » ?`)) return;
    const { error } = await supabase.from("site_settings").delete().eq("key", key);
    if (error) return toast.error(error.message);
    setRows((p) => p.filter((r) => r.key !== key));
    toast.success("Supprimé");
  };

  const add = async () => {
    const k = newKey.trim();
    if (!k) return toast.error("Clé requise");
    if (rows.some((r) => r.key === k)) return toast.error("Cette clé existe déjà");
    const { error } = await supabase
      .from("site_settings")
      .insert({ key: k, value: newValue });
    if (error) return toast.error(error.message);
    setNewKey("");
    setNewValue("");
    load();
    toast.success("Ajouté");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-base font-bold">Ajouter un paramètre</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="clé (ex: site_motto)"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="valeur"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={add}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Ces paramètres sont publics. Pour les jetons d'API, utilisez la page « Publications ».
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-bold">Paramètres du site</div>
        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Aucun paramètre configuré.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.key} className="grid gap-3 p-4 md:grid-cols-[1fr_2fr_auto] md:items-center">
                <code className="text-sm font-semibold text-foreground">{r.key}</code>
                <input
                  value={r.value ?? ""}
                  onChange={(e) =>
                    setRows((p) => p.map((x) => (x.key === r.key ? { ...x, value: e.target.value } : x)))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => save(r)}
                    disabled={savingKey === r.key}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-60"
                  >
                    {savingKey === r.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Enregistrer
                  </button>
                  <button
                    onClick={() => remove(r.key)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}