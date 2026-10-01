import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/require-admin";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

const ALLOWED_FILE_MIME = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

const TargetType = z.enum(["blog", "actualite", "portfolio"]);

const DocInput = z.object({
  targetType: TargetType,
  fileName: z.string().max(255).optional(),
  mimeType: z.string().max(120).optional(),
  // Pour PDF / images : data URL base64. Pour TXT/DOCX extrait : texte brut.
  fileDataUrl: z.string().max(10_000_000).optional(),
  textContent: z.string().max(200_000).optional(),
  instructions: z.string().max(2000).optional(),
}).refine(
  (d) => !d.fileDataUrl || (d.mimeType !== undefined && ALLOWED_FILE_MIME.includes(d.mimeType)),
  { message: "Type de fichier non autorisé (PNG, JPEG, WEBP ou PDF uniquement)." },
);

const TARGET_GUIDELINES: Record<z.infer<typeof TargetType>, string> = {
  blog:
    "Tu rédiges un article de blog professionnel pour Flaugust Business (cabinet de conseil tech & IA en Afrique). Style : éditorial, structuré, expert mais accessible. Contenu HTML enrichi avec <h2>, <h3>, <p>, <ul>, <strong>. Vise 600-1200 mots. Inclure une introduction, 2-4 sections, une conclusion.",
  actualite:
    "Tu rédiges une actualité courte et percutante pour Flaugust Business. Style : informatif, factuel, engageant. Contenu HTML simple (<p>, <strong>, <em>, <ul>). Vise 150-400 mots. Format communiqué : qui, quoi, quand, où, pourquoi.",
  portfolio:
    "Tu rédiges la fiche d'une réalisation/projet pour le portfolio Flaugust Business. Style : étude de cas concise. Contenu HTML structuré avec <h3>Contexte</h3>, <h3>Solution</h3>, <h3>Résultats</h3>. Vise 250-500 mots.",
};

const generationTool = {
  type: "function" as const,
  function: {
    name: "produce_content",
    description: "Produit le titre, l'extrait et le contenu HTML.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Titre accrocheur, max 110 caractères." },
        excerpt: { type: "string", description: "Résumé court 1-2 phrases, max 200 caractères." },
        content: { type: "string", description: "Contenu HTML formaté (balises autorisées : h2, h3, p, ul, ol, li, strong, em, a)." },
      },
      required: ["title", "excerpt", "content"],
      additionalProperties: false,
    },
  },
};

function buildMultimodalContent(input: z.infer<typeof DocInput>) {
  const parts: Array<Record<string, unknown>> = [];
  const instr = input.instructions?.trim();
  const intro = [
    TARGET_GUIDELINES[input.targetType],
    "",
    "À partir du document/contenu fourni, génère un contenu prêt à publier en français.",
    instr ? `Consignes spécifiques de l'auteur : ${instr}` : "",
    "Appelle obligatoirement l'outil `produce_content` avec title, excerpt, content.",
  ]
    .filter(Boolean)
    .join("\n");
  parts.push({ type: "text", text: intro });

  if (input.textContent && input.textContent.trim()) {
    parts.push({ type: "text", text: `\n\nContenu source :\n\n${input.textContent}` });
  }

  if (input.fileDataUrl && input.mimeType) {
    if (input.mimeType.startsWith("image/")) {
      parts.push({ type: "image_url", image_url: { url: input.fileDataUrl } });
    } else {
      // Gemini via gateway accepte les PDF en image_url data URL également.
      parts.push({ type: "image_url", image_url: { url: input.fileDataUrl } });
    }
  }
  return parts;
}

export const generateFromDocument = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => DocInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { success: false as const, error: "Clé IA non configurée." };
    }
    if (!data.fileDataUrl && !data.textContent) {
      return { success: false as const, error: "Aucun contenu fourni." };
    }

    try {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "Tu es un rédacteur expert pour Flaugust Business. Tu écris uniquement en français, sans guillemets superflus, avec un ton professionnel et clair.",
            },
            { role: "user", content: buildMultimodalContent(data) },
          ],
          tools: [generationTool],
          tool_choice: { type: "function", function: { name: "produce_content" } },
        }),
      });

      if (res.status === 429) {
        return { success: false as const, error: "Limite IA atteinte. Réessayez dans une minute." };
      }
      if (res.status === 402) {
        return { success: false as const, error: "Crédits IA épuisés. Ajoutez des crédits dans Lovable." };
      }
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { success: false as const, error: `Erreur IA (${res.status}).` };
      }

      const json = (await res.json()) as {
        choices?: Array<{
          message?: {
            tool_calls?: Array<{ function?: { arguments?: string } }>;
            content?: string;
          };
        }>;
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!args) {
        return { success: false as const, error: "Réponse IA invalide." };
      }
      const parsed = JSON.parse(args) as { title: string; excerpt: string; content: string };
      return {
        success: true as const,
        title: String(parsed.title ?? "").slice(0, 200),
        excerpt: String(parsed.excerpt ?? "").slice(0, 300),
        content: String(parsed.content ?? ""),
      };
    } catch (err) {
      console.error("generateFromDocument failed", err);
      return { success: false as const, error: "Échec de la génération IA." };
    }
  });

const BriefingInput = z.object({
  unreadMessages: z.number().int().min(0).max(100000),
  publishedPosts: z.number().int().min(0).max(100000),
  publishedProjects: z.number().int().min(0).max(100000),
  publishedActualites: z.number().int().min(0).max(100000),
  recentTitles: z.array(z.string().max(200)).max(10).optional(),
});

export const dailyBriefing = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => BriefingInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { success: false as const, error: "Clé IA non configurée." };
    try {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Tu es l'assistant éditorial de Flaugust Business. Tu produis un résumé exécutif quotidien, en français, 3-5 phrases maximum, ton professionnel, avec une recommandation concrète d'action. Pas de markdown, pas de listes.",
            },
            {
              role: "user",
              content: `Voici l'état du jour :
- Messages non lus : ${data.unreadMessages}
- Articles publiés : ${data.publishedPosts}
- Projets publiés : ${data.publishedProjects}
- Actualités publiées : ${data.publishedActualites}
- Derniers titres : ${data.recentTitles?.join(" | ") || "aucun"}

Rédige le résumé du jour pour l'équipe.`,
            },
          ],
        }),
      });
      if (res.status === 429) return { success: false as const, error: "Limite IA atteinte." };
      if (res.status === 402) return { success: false as const, error: "Crédits IA épuisés." };
      if (!res.ok) {
        console.error("dailyBriefing gateway error", res.status);
        return { success: false as const, error: `Erreur IA (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { success: false as const, error: "Réponse IA vide." };
      return { success: true as const, summary: text };
    } catch (err) {
      console.error("dailyBriefing failed", err);
      return { success: false as const, error: "Échec de la génération." };
    }
  });