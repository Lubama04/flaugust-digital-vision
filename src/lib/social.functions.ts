import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Platform = "linkedin" | "facebook";

const PlatformEnum = z.enum(["linkedin", "facebook"]);

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ---------- Credentials (server-only) ----------

export const saveCredential = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ key: z.string().min(1).max(80), value: z.string().max(8000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { error } = await admin
      .from("integration_credentials")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  });

export const getCredentialStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ keys: z.array(z.string().max(80)).max(20) }).parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { data: rows, error } = await admin
      .from("integration_credentials")
      .select("key, value, updated_at")
      .in("key", data.keys);
    if (error) return { success: false as const, error: error.message };
    return {
      success: true as const,
      status: (rows ?? []).map((r) => ({
        key: r.key,
        configured: Boolean(r.value && r.value.length > 0),
        updated_at: r.updated_at,
      })),
    };
  });

// ---------- AI adaptation ----------

const AdaptInput = z.object({
  platform: PlatformEnum,
  source: z.string().min(10).max(5000),
});

export const adaptForPlatform = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AdaptInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { success: false as const, error: "Clé IA non configurée." };
    const platformInstr =
      data.platform === "linkedin"
        ? "Rédige un post LinkedIn professionnel (200-400 mots), avec accroche forte, structure aérée (sauts de ligne), 3-5 hashtags pertinents en fin. Ton expert mais humain."
        : "Rédige un post Facebook engageant (80-200 mots), ton conversationnel, 2-3 emojis maximum, 2-4 hashtags en fin.";
    try {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Tu es community manager pour Flaugust Business. Tu écris en français." },
            { role: "user", content: `${platformInstr}\n\nSource :\n${data.source}` },
          ],
        }),
      });
      if (res.status === 429) return { success: false as const, error: "Limite IA atteinte." };
      if (res.status === 402) return { success: false as const, error: "Crédits IA épuisés." };
      if (!res.ok) return { success: false as const, error: `Erreur IA (${res.status}).` };
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { success: false as const, error: "Réponse IA vide." };
      return { success: true as const, content: text };
    } catch (err) {
      console.error("adaptForPlatform failed", err);
      return { success: false as const, error: "Échec de l'adaptation IA." };
    }
  });

// ---------- Publication ----------

const PublishInput = z.object({
  platform: PlatformEnum,
  content: z.string().min(1).max(8000),
});

async function publishLinkedIn(content: string): Promise<{ ok: true; url: string | null } | { ok: false; error: string }> {
  const admin = await getAdmin();
  const { data: rows } = await admin
    .from("integration_credentials")
    .select("key, value")
    .in("key", ["linkedin_token", "linkedin_author_urn"]);
  const map = new Map((rows ?? []).map((r) => [r.key, r.value ?? ""]));
  const token = map.get("linkedin_token");
  const author = map.get("linkedin_author_urn");
  if (!token) return { ok: false, error: "Jeton LinkedIn non configuré." };
  if (!author) return { ok: false, error: "URN auteur LinkedIn non configuré (ex: urn:li:person:xxx)." };
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    return { ok: false, error: `LinkedIn ${res.status}: ${t.slice(0, 200)}` };
  }
  const json = (await res.json()) as { id?: string };
  return { ok: true, url: json.id ? `https://www.linkedin.com/feed/update/${json.id}` : null };
}

async function publishFacebook(content: string): Promise<{ ok: true; url: string | null } | { ok: false; error: string }> {
  const admin = await getAdmin();
  const { data: rows } = await admin
    .from("integration_credentials")
    .select("key, value")
    .in("key", ["facebook_page_id", "facebook_page_token"]);
  const map = new Map((rows ?? []).map((r) => [r.key, r.value ?? ""]));
  const pageId = map.get("facebook_page_id");
  const token = map.get("facebook_page_token");
  if (!pageId) return { ok: false, error: "Page ID Facebook non configuré." };
  if (!token) return { ok: false, error: "Jeton Page Facebook non configuré." };
  const params = new URLSearchParams({ message: content, access_token: token });
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: "POST",
    body: params,
  });
  if (!res.ok) {
    const t = await res.text();
    return { ok: false, error: `Facebook ${res.status}: ${t.slice(0, 200)}` };
  }
  const json = (await res.json()) as { id?: string };
  return {
    ok: true,
    url: json.id ? `https://www.facebook.com/${json.id}` : null,
  };
}

export const publishToSocial = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PublishInput.parse(input))
  .handler(async ({ data }) => {
    const platform: Platform = data.platform;
    const result =
      platform === "linkedin" ? await publishLinkedIn(data.content) : await publishFacebook(data.content);
    const admin = await getAdmin();
    await admin.from("social_posts").insert({
      platform,
      content: data.content,
      post_url: result.ok ? result.url : null,
      status: result.ok ? "published" : "failed",
      error: result.ok ? null : result.error,
    });
    if (result.ok) return { success: true as const, url: result.url };
    return { success: false as const, error: result.error };
  });