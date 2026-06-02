import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Upload, GripVertical, Star as StarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import { ACTUALITE_CATEGORIES, categoryMeta, type ActualiteCategoryKey } from "@/lib/actualiteCategories";
import { formatDate } from "@/lib/dateUtils";
import { AIDocumentProcessor } from "@/components/admin/AIDocumentProcessor";

export const Route = createFileRoute("/admin/actualites")({
  component: ActualitesManager,
});

type Row = {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  category: string;
  custom_category: string | null;
  images_urls: string[] | null;
  published: boolean;
  created_at: string;
  published_at: string | null;
};

const MAX_IMAGES = 10;

function ActualitesManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("actualites")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Erreur de chargement");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublished = async (row: Row) => {
    const newVal = !row.published;
    const { error } = await supabase
      .from("actualites")
      .update({
        published: newVal,
        published_at: newVal ? new Date().toISOString() : null,
      })
      .eq("id", row.id);
    if (error) return toast.error("Erreur");
    toast.success(newVal ? "Actualité publiée" : "Actualité masquée");
    load();
  };

  const remove = async (row: Row) => {
    if (!confirm(`Supprimer "${row.title}" ? Cette action est irréversible.`)) return;
    const { error } = await supabase.from("actualites").delete().eq("id", row.id);
    if (error) return toast.error("Erreur de suppression");
    toast.success("Actualité supprimée");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} actualité(s)</p>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Nouvelle actualité
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-sm text-muted-foreground">Aucune actualité pour le moment.</p>
          <button
            onClick={() => setEditing("new")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> Créer la première
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const meta = categoryMeta(r.category);
            const cover = r.images_urls?.[0];
            return (
              <div
                key={r.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {cover ? (
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground/40">
                      <Megaphone />
                    </div>
                  )}
                  <span
                    className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.emoji} {r.category === "Autre" && r.custom_category ? r.custom_category : r.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-base font-bold text-foreground">{r.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(r.published_at ?? r.created_at)}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <button
                      onClick={() => togglePublished(r)}
                      className="inline-flex items-center gap-1 text-xs"
                    >
                      {r.published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-1 font-bold text-secondary">
                          <Eye className="h-3 w-3" /> Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-bold text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> Brouillon
                        </span>
                      )}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(r)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                        aria-label="Éditer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(r)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-red-500"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <ActualiteForm
          initial={editing === "new" ? null : editing}
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

// Tiny inline icon (lucide already imported above missed it for placeholder)
function Megaphone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
      <path d="M3 11v2a2 2 0 0 0 2 2h2l4 4V5L7 9H5a2 2 0 0 0-2 2z" />
      <path d="M16 8a4 4 0 0 1 0 8" />
    </svg>
  );
}

// ============================================================
// Slide-in form
// ============================================================
function ActualiteForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Row | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState<ActualiteCategoryKey>(
    (initial?.category as ActualiteCategoryKey) ?? "Projet",
  );
  const [customCategory, setCustomCategory] = useState(initial?.custom_category ?? "");
  const [images, setImages] = useState<string[]>(initial?.images_urls ?? []);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [publishedAt, setPublishedAt] = useState<string>(
    initial?.published_at
      ? new Date(initial.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images par actualité.`);
      return;
    }
    const toUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setUploadProgress({ current: 0, total: toUpload.length });
    const uploaded: string[] = [];
    for (let i = 0; i < toUpload.length; i++) {
      try {
        const url = await uploadImage(toUpload[i], "actualites");
        uploaded.push(url);
        setUploadProgress({ current: i + 1, total: toUpload.length });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erreur d'upload");
      }
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    setUploadProgress(null);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Le titre est obligatoire");
    if (!content.trim()) return toast.error("Le contenu est obligatoire");
    if (category === "Autre" && !customCategory.trim())
      return toast.error("Précisez la catégorie personnalisée");

    setSaving(true);
    const payload = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || null,
      category,
      custom_category: category === "Autre" ? customCategory.trim() : null,
      images_urls: images,
      published,
      published_at: published ? new Date(publishedAt).toISOString() : null,
    };

    const { error } = initial
      ? await supabase.from("actualites").update(payload).eq("id", initial.id)
      : await supabase.from("actualites").insert(payload);

    setSaving(false);
    if (error) {
      toast.error("Erreur lors de l'enregistrement");
      return;
    }
    toast.success(initial ? "Actualité mise à jour" : "Actualité créée");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} aria-label="Fermer" />
      <form
        onSubmit={onSubmit}
        className="flex h-full w-full max-w-[600px] flex-col overflow-y-auto bg-card shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">
            {initial ? "Modifier l'actualité" : "Nouvelle actualité"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 px-6 py-5">
          <AIDocumentProcessor
            targetType="actualite"
            onApply={(d) => {
              if (d.title) setTitle(d.title);
              if (d.excerpt) setExcerpt(d.excerpt);
              if (d.content) setContent(d.content);
            }}
          />

          <Field label="Titre *">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="input"
              placeholder="Titre de l'actualité"
              required
            />
          </Field>

          <Field label="Contenu *">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input min-h-[160px]"
              placeholder="Contenu de l'actualité (HTML autorisé)"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              HTML basique accepté : &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;a&gt;…
            </p>
          </Field>

          <Field label="Extrait (optionnel)">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={200}
              rows={2}
              className="input"
              placeholder="Court résumé (max 200 caractères)"
            />
            <p className="mt-1 text-xs text-muted-foreground">{excerpt.length}/200</p>
          </Field>

          <Field label="Catégorie *">
            <div className="flex flex-wrap gap-2">
              {ACTUALITE_CATEGORIES.map((c) => {
                const active = category === c.key;
                return (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
                    style={
                      active
                        ? { backgroundColor: c.color, color: "white", borderColor: c.color }
                        : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                    }
                  >
                    {c.emoji} {c.key}
                  </button>
                );
              })}
            </div>
            {category === "Autre" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                maxLength={60}
                className="input mt-2"
                placeholder="Précisez la catégorie…"
              />
            )}
          </Field>

          <Field label={`Images (${images.length}/${MAX_IMAGES})`}>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/60">
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {uploading
                  ? `Upload en cours… ${uploadProgress?.current ?? 0}/${uploadProgress?.total ?? 0}`
                  : "Ajouter des images"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPG, PNG, WebP — max 5 Mo par image
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={uploading || images.length >= MAX_IMAGES}
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((url, i) => (
                  <div
                    key={url + i}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        <StarIcon className="h-3 w-3" /> Couverture
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(i, i - 1)}
                          disabled={i === 0}
                          className="rounded p-1 text-white/80 hover:bg-white/20 disabled:opacity-30"
                          aria-label="Déplacer à gauche"
                        >
                          <GripVertical className="h-3 w-3 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, i + 1)}
                          disabled={i === images.length - 1}
                          className="rounded p-1 text-white/80 hover:bg-white/20 disabled:opacity-30"
                          aria-label="Déplacer à droite"
                        >
                          <GripVertical className="h-3 w-3 rotate-90" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="rounded p-1 text-white/90 hover:bg-red-500/80"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label="Date de publication">
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Statut">
            <label className="inline-flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="text-sm font-medium text-foreground">
                {published ? "Publié — visible sur le site" : "Brouillon — non visible"}
              </span>
            </label>
          </Field>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--card);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}