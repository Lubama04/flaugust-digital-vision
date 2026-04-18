import { useEffect, useRef, useState } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Upload, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import { slugify } from "@/lib/slug";
import { RichEditor } from "./RichEditor";
import { TagInput } from "./PortfolioForm";

const CATEGORIES = ["Technologie", "IA", "Marketing Digital", "Afrique Numérique", "Formation", "Actualités", "Étude de cas"];

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  read_time: number;
  published_at: string;
};

const empty: Form = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: null,
  category: "Technologie",
  tags: [],
  author: "LUBAMA Jean Chrysostome ZACEI",
  published: false,
  read_time: 5,
  published_at: new Date().toISOString().slice(0, 16),
};

export function PostEditor({ postId }: { postId: string | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [autosaved, setAutosaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const currentId = useRef<string | null>(postId);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", postId).maybeSingle();
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          cover_url: data.cover_url,
          category: data.category ?? "Technologie",
          tags: data.tags ?? [],
          author: data.author ?? "LUBAMA Jean Chrysostome ZACEI",
          published: data.published,
          read_time: data.read_time ?? 5,
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        });
      }
      setLoading(false);
    })();
  }, [postId]);

  const persist = async (publishOverride?: boolean): Promise<string | null> => {
    const slug = form.slug || slugify(form.title);
    if (!form.title.trim()) {
      toast.error("Le titre est requis");
      return null;
    }
    const payload = {
      title: form.title,
      slug,
      excerpt: form.excerpt,
      content: form.content,
      cover_url: form.cover_url,
      category: form.category,
      tags: form.tags,
      author: form.author,
      read_time: form.read_time,
      published: publishOverride ?? form.published,
      published_at: (publishOverride ?? form.published) ? new Date(form.published_at).toISOString() : null,
    };
    if (currentId.current) {
      const { error } = await supabase.from("posts").update(payload).eq("id", currentId.current);
      if (error) {
        toast.error("Erreur d'enregistrement", { description: error.message });
        return null;
      }
      return currentId.current;
    } else {
      const { data, error } = await supabase.from("posts").insert(payload).select("id").single();
      if (error) {
        toast.error("Erreur d'enregistrement", { description: error.message });
        return null;
      }
      currentId.current = data.id;
      return data.id;
    }
  };

  // Autosave every 30s when there's a draft
  useEffect(() => {
    if (loading) return;
    const id = setInterval(async () => {
      if (!form.title.trim()) return;
      const newId = await persist();
      if (newId) setAutosaved(new Date().toLocaleTimeString("fr-FR"));
    }, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, loading]);

  const saveDraft = async () => {
    setSaving(true);
    const id = await persist(false);
    setSaving(false);
    if (!id) return;
    toast.success("Brouillon enregistré");
    if (!postId) router.navigate({ to: "/admin/blog/$id", params: { id } });
  };

  const publish = async () => {
    setSaving(true);
    const id = await persist(true);
    setSaving(false);
    if (!id) return;
    toast.success("Article publié");
    router.navigate({ to: "/admin/blog" });
  };

  const handleCoverUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "blog");
      setForm({ ...form, cover_url: url });
      toast.success("Image téléversée");
    } catch (e) {
      toast.error("Erreur d'upload", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/admin/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Retour
        </Link>
        {autosaved && <span className="text-xs text-muted-foreground">Brouillon sauvegardé à {autosaved}</span>}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
            placeholder="Titre de l'article"
            className="w-full border-0 bg-transparent text-2xl font-bold text-foreground focus:outline-none"
          />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            placeholder="slug-article"
            className="w-full border-0 bg-transparent text-sm text-muted-foreground focus:outline-none"
          />
          <RichEditor
            content={form.content}
            onChange={(html, wordCount) => setForm({ ...form, content: html, read_time: Math.max(1, Math.ceil(wordCount / 200)) })}
          />
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-semibold">Statut</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${form.published ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>
                {form.published ? "Publié" : "Brouillon"}
              </span>
            </label>
            <div className="mt-3 space-y-2">
              <button onClick={saveDraft} disabled={saving} className="w-full rounded-lg border border-border bg-background py-2 text-sm font-semibold hover:bg-muted disabled:opacity-70">
                {saving ? "…" : "Enregistrer le brouillon"}
              </button>
              <button onClick={publish} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-70">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Publier
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <Label>Date de publication</Label>
            <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className={inputCls} />

            <Label>Catégorie</Label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <TagInput label="Tags" values={form.tags} onChange={(tags) => setForm({ ...form, tags })} />

            <Label>Extrait</Label>
            <textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputCls} placeholder="Résumé court affiché dans la liste…" />

            <Label>Image de couverture</Label>
            {form.cover_url && <img src={form.cover_url} alt="" className="aspect-video w-full rounded-lg object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {form.cover_url ? "Remplacer" : "Téléverser"}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
            </label>

            <Label>Temps de lecture (min)</Label>
            <input type="number" min={1} value={form.read_time} onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })} className={inputCls} />

            <Label>Auteur</Label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputCls} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</div>;
}
