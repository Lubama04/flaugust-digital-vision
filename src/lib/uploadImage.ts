import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(
  file: File,
  folder: "portfolio" | "blog" | "avatars",
): Promise<string> {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Type de fichier non autorisé (JPEG, PNG, WebP).");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Fichier trop volumineux (max 5 Mo).");
  }
  const ext = file.name.split(".").pop() ?? "bin";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(filename);
  return data.publicUrl;
}
