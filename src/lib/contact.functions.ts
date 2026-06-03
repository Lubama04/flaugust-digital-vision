import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  organization: z.string().trim().max(150).optional(),
  email: z.string().trim().email().max(255),
  subject: z.string().min(1).max(100),
  budget: z.string().min(1).max(100),
  message: z.string().trim().min(10).max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    // Save to Supabase as secondary store (best-effort, never blocks user).
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("contact_messages").insert({
        full_name: data.name,
        email: data.email,
        organization: data.organization ?? null,
        subject: data.subject,
        budget: data.budget,
        message: data.message,
      });
    } catch (err) {
      console.error("Failed to log contact_message:", err);
    }

    const accessKey = process.env.WEB3FORMS_KEY;
    if (!accessKey) {
      console.error("WEB3FORMS_KEY is not configured");
      return { success: false, error: "Service indisponible. Veuillez réessayer plus tard." };
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Nouveau contact depuis le site — ${data.name}`,
          from_name: "Flaugust Business Website",
          reply_to: data.email,
          "Nom complet": data.name,
          Email: data.email,
          Organisation: data.organization || "Non précisée",
          "Objet du projet": data.subject,
          "Budget estimatif": data.budget,
          Message: data.message,
        }),
      });

      const result = (await response.json()) as { success?: boolean };
      if (result.success) return { success: true as const, error: null };
      console.error("Web3Forms returned non-success", result);
      return { success: false, error: "Échec de l'envoi. Veuillez réessayer." };
    } catch (err) {
      console.error("Web3Forms request failed:", err);
      return { success: false, error: "Erreur réseau. Veuillez réessayer." };
    }
  });