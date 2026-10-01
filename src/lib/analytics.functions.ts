import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/require-admin";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const Input = z.object({
  totalViews: z.number().int().min(0).max(100_000_000),
  uniquePages: z.number().int().min(0).max(100_000),
  topPages: z.array(z.object({ page: z.string().max(200), count: z.number().int() })).max(20),
  byDevice: z.array(z.object({ device: z.string().max(40), count: z.number().int() })).max(10),
  trend: z.array(z.object({ date: z.string().max(20), count: z.number().int() })).max(60),
});

export const interpretAnalytics = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { success: false as const, error: "Clé IA non configurée." };
    try {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Tu es un analyste web pour Flaugust Business. Tu interprètes les statistiques de fréquentation en français, 4-6 phrases, ton clair et actionnable. Identifie 1 tendance, 1 force, 1 axe d'amélioration. Pas de markdown.",
            },
            {
              role: "user",
              content: `Données analytics :
- Vues totales : ${data.totalViews}
- Pages uniques : ${data.uniquePages}
- Top pages : ${data.topPages.map((p) => `${p.page} (${p.count})`).join(", ")}
- Appareils : ${data.byDevice.map((d) => `${d.device}: ${d.count}`).join(", ")}
- Tendance journalière : ${data.trend.map((t) => `${t.date}=${t.count}`).join(", ")}

Rédige l'interprétation.`,
            },
          ],
        }),
      });
      if (res.status === 429) return { success: false as const, error: "Limite IA atteinte." };
      if (res.status === 402) return { success: false as const, error: "Crédits IA épuisés." };
      if (!res.ok) return { success: false as const, error: `Erreur IA (${res.status}).` };
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { success: false as const, error: "Réponse IA vide." };
      return { success: true as const, summary: text };
    } catch (err) {
      console.error("interpretAnalytics failed", err);
      return { success: false as const, error: "Échec de l'analyse IA." };
    }
  });