import { useRef, useState } from "react";
import { Sparkles, Upload, Loader2, Check, X, FileText } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateFromDocument } from "@/lib/ai.functions";

export type AITargetType = "blog" | "actualite" | "portfolio";

type GeneratePayload = {
  targetType: AITargetType;
  fileName?: string;
  mimeType?: string;
  fileDataUrl?: string;
  textContent?: string;
  instructions?: string;
};

export type AIGenerated = {
  title: string;
  excerpt: string;
  content: string;
};

type Props = {
  targetType: AITargetType;
  onApply: (data: AIGenerated) => void;
  /** Compact label affiché dans l'en-tête */
  label?: string;
};

const ACCEPTED =
  "application/pdf,image/jpeg,image/png,image/webp,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.txt,.md,.docx,.pdf";

const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function AIDocumentProcessor({ targetType, onApply, label }: Props) {
  const callGenerate = useServerFn(generateFromDocument);
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIGenerated | null>(null);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setInstructions("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      toast.error("Fichier trop volumineux", { description: "Maximum 10 Mo." });
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!file && !instructions.trim()) {
      toast.error("Ajoutez un fichier ou des instructions.");
      return;
    }
    setLoading(true);
    try {
      let payload: GeneratePayload;
      if (!file) {
        payload = { targetType, instructions: instructions.trim() };
      } else {
        const isText =
          file.type.startsWith("text/") ||
          file.name.endsWith(".txt") ||
          file.name.endsWith(".md");
        if (isText) {
          const text = await readAsText(file);
          payload = {
            targetType,
            fileName: file.name,
            mimeType: file.type || "text/plain",
            textContent: text.slice(0, 200_000),
            instructions: instructions.trim() || undefined,
          };
        } else if (
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith(".docx")
        ) {
          // DOCX : pas de parsing côté serveur — on tente lecture texte brute (souvent peu utile),
          // l'IA traitera mieux un export PDF/TXT. On informe l'utilisateur.
          toast.info("Astuce : pour DOCX, préférez un export PDF ou TXT.", { duration: 4000 });
          payload = {
            targetType,
            fileName: file.name,
            mimeType: file.type,
            instructions:
              (instructions.trim() ? instructions.trim() + "\n\n" : "") +
              "(L'utilisateur a fourni un fichier .docx — utilise le nom du fichier comme indice et invite à fournir le texte si nécessaire.)",
          };
        } else {
          const dataUrl = await readAsDataURL(file);
          payload = {
            targetType,
            fileName: file.name,
            mimeType: file.type || "application/pdf",
            fileDataUrl: dataUrl,
            instructions: instructions.trim() || undefined,
          };
        }
      }
      const res = await callGenerate({ data: payload });
      if (!res.success) {
        toast.error("Génération échouée", { description: res.error });
      } else {
        setResult({ title: res.title, excerpt: res.excerpt, content: res.content });
        toast.success("Contenu généré — vérifiez puis appliquez.");
      }
    } catch (err) {
      toast.error("Erreur", { description: err instanceof Error ? err.message : undefined });
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!result) return;
    onApply(result);
    toast.success("Contenu appliqué au formulaire");
    reset();
    setExpanded(false);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
          <Sparkles className="h-4 w-4" />
          {label ?? "Générer avec l'IA depuis un document"}
        </span>
        <span className="text-xs text-muted-foreground">{expanded ? "Replier" : "Déplier"}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-background px-4 py-5 text-center hover:bg-muted/40">
            {file ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4" /> {file.name}
              </span>
            ) : (
              <>
                <Upload className="mb-2 h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Choisir un fichier source</span>
                <span className="mt-1 text-xs text-muted-foreground">PDF, image, TXT, MD — 10 Mo max</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Consignes optionnelles (ton, angle, mots-clés à inclure…)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Générer
            </button>
            {(file || result || instructions) && (
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {result && (
            <div className="space-y-2 rounded-xl border border-border bg-card p-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Titre</p>
                <p className="text-sm font-semibold text-foreground">{result.title}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Extrait</p>
                <p className="text-sm text-foreground">{result.excerpt}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Aperçu contenu</p>
                <div
                  className="prose prose-sm max-h-48 overflow-y-auto rounded-lg border border-border bg-background p-2 text-xs text-foreground"
                  dangerouslySetInnerHTML={{ __html: result.content }}
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={apply}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground hover:opacity-90"
                >
                  <Check className="h-3.5 w-3.5" /> Appliquer au formulaire
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" /> Ignorer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}