import { useEffect, useState } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import { slugify } from "@/lib/slug";
import { AIDocumentProcessor } from "./AIDocumentProcessor";

type Props = {
  id: string | null;
  onClose: () => void;
  onSaved: () => void;
};

const CATEGORIES = ["ONG", "Agent IA", "SaaS", "Édition Numérique", "Application Web", "Institution Religieuse", "Conseil", "Formation"];

type Form = {
  title: string;
  slug: string;
  category: string;
  category_color: string;
  client: string;
  country: string;
  flag: string;
  year: string;
  services: string[];
  stack: string[];
  challenge: string;
  solution: string;
  results: string[];
  color: string;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

const empty: Form = {
  title: "",
  slug: "",
  category: "ONG",
  category_color: "#7B3415",
  client: "",
  country: "",
  flag: "",
  year: new Date().getFullYear().toString(),
  services: [],
  stack: [],
  challenge: "",
  solution: "",
  results: [""],
  color: "#7B3415",
  image_url: null,
  published: true,
  sort_order: 0,
};

export function PortfolioForm({ id, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("portfolio").select("*").eq("id", id).maybeSingle();
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          category: data.category,
          category_color: data.category_color ?? "#7B3415",
          client: data.client ?? "",
          country: data.country ?? "",
          flag: data.flag ?? "",
          year: data.year ?? "",
          services: data.services ?? [],
          stack: data.stack ?? [],
          challenge: data.challenge ?? "",
          solution: data.solution ?? "",
          results: data.results?.length ? data.results : [""],
          color: data.color ?? "#7B3415",
          image_url: data.image_url ?? null,
          published: data.published,
          sort_order: data.sort_order ?? 0,
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Le titre est requis");
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      results: form.results.filter((r) => r.trim()),
    };
    const { error } = id
      ? await supabase.from("portfolio").update(payload).eq("id", id)
      : await supabase.from("portfolio").insert(payload);
    setSaving(false);
    if (error) return toast.error("Erreur d'enregistrement", { description: error.message });
    toast.success("Projet enregistré");
    onSaved();
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "portfolio");
      setForm({ ...form, image_url: url });
      toast.success("Image téléversée");
    } catch (e) {
      toast.error("Erreur d'upload", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <aside className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{id ? "Modifier le projet" : "Nouveau projet"}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </header>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={submit} className="flex-1 space-y-4 overflow-y-auto p-6">
            <AIDocumentProcessor
              targetType="portfolio"
              onApply={(d) =>
                setForm((f) => ({
                  ...f,
                  title: d.title || f.title,
                  slug: f.slug || slugify(d.title || f.title),
                  challenge: d.excerpt || f.challenge,
                  solution: d.content || f.solution,
                }))
              }
            />
            <Field label="Titre *">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
                className={inputCls}
                required
              />
            </Field>
            <Field label="Slug">
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className={inputCls} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Catégorie *">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Couleur projet">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-full rounded-lg border border-border" />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Client"><input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={inputCls} /></Field>
              <Field label="Pays"><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} /></Field>
              <Field label="Drapeau"><input value={form.flag} onChange={(e) => setForm({ ...form, flag: e.target.value })} className={inputCls} placeholder="🇨🇫" /></Field>
            </div>
            <Field label="Année"><input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls} /></Field>

            <TagInput label="Services fournis" values={form.services} onChange={(v) => setForm({ ...form, services: v })} />
            <TagInput label="Stack technique" values={form.stack} onChange={(v) => setForm({ ...form, stack: v })} />

            <Field label="Défi"><textarea rows={3} value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} className={inputCls} /></Field>
            <Field label="Solution"><textarea rows={3} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} className={inputCls} /></Field>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">Résultats</label>
              {form.results.map((r, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <input
                    value={r}
                    onChange={(e) => {
                      const v = [...form.results];
                      v[i] = e.target.value;
                      setForm({ ...form, results: v });
                    }}
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setForm({ ...form, results: form.results.filter((_, j) => j !== i) })} className="rounded p-2 hover:bg-muted">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, results: [...form.results, ""] })} className="text-xs font-semibold text-primary hover:underline">
                + Ajouter un résultat
              </button>
            </div>

            <Field label="Image principale">
              <div className="flex items-center gap-3">
                {form.image_url && <img src={form.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {form.image_url ? "Remplacer" : "Téléverser"}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                </label>
                {form.image_url && (
                  <button type="button" onClick={() => setForm({ ...form, image_url: null })} className="text-xs text-red-500 hover:underline">
                    Retirer
                  </button>
                )}
              </div>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Ordre d'affichage">
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputCls} />
              </Field>
              <label className="flex items-end gap-3 pb-2">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-5 w-5" />
                <span className="text-sm font-semibold">Publié</span>
              </label>
            </div>
          </form>
        )}
        <footer className="flex items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
            Annuler
          </button>
          <button onClick={submit} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-70">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
        </footer>
      </aside>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

export function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-background p-2">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              if (input.trim()) {
                onChange([...values, input.trim()]);
                setInput("");
              }
            }
          }}
          className="flex-1 bg-transparent px-1 text-sm outline-none"
          placeholder="Tapez puis Entrée…"
        />
      </div>
    </div>
  );
}
