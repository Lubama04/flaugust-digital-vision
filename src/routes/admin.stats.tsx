import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/stats")({
  component: StatsManager,
});

type Row = {
  id: string;
  value: number;
  suffix: string | null;
  label: string;
  sort_order: number;
};

function StatsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("stats").select("*").order("sort_order");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<Row>) => {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const save = async (r: Row) => {
    setSavingId(r.id);
    const { error } = await supabase.from("stats").update({ value: r.value, suffix: r.suffix, label: r.label, sort_order: r.sort_order }).eq("id", r.id);
    setSavingId(null);
    if (error) return toast.error("Erreur");
    toast.success("Statistique enregistrée");
  };

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">Modifiez les compteurs affichés sur la page d'accueil.</p>
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="grid items-end gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[120px_120px_1fr_100px_auto_auto]">
              <Field label="Valeur"><input type="number" value={r.value} onChange={(e) => update(r.id, { value: Number(e.target.value) })} className={inputCls} /></Field>
              <Field label="Suffixe"><input value={r.suffix ?? ""} onChange={(e) => update(r.id, { suffix: e.target.value })} className={inputCls} placeholder="+ % …" /></Field>
              <Field label="Libellé"><input value={r.label} onChange={(e) => update(r.id, { label: e.target.value })} className={inputCls} /></Field>
              <Field label="Ordre"><input type="number" value={r.sort_order} onChange={(e) => update(r.id, { sort_order: Number(e.target.value) })} className={inputCls} /></Field>
              <div className="rounded-lg bg-primary px-4 py-3 text-center text-white">
                <div className="font-display text-2xl font-bold">{r.value}{r.suffix}</div>
              </div>
              <button onClick={() => save(r)} disabled={savingId === r.id} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
                {savingId === r.id && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
