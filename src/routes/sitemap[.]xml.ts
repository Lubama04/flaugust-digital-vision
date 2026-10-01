import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SITE = "https://www.flaugustbusiness.com";
const STATIC: Array<{ path: string; freq: string; priority: string }> = [
  { path: "/", freq: "weekly", priority: "1.0" },
  { path: "/services", freq: "monthly", priority: "0.9" },
  { path: "/portfolio", freq: "weekly", priority: "0.9" },
  { path: "/about", freq: "monthly", priority: "0.8" },
  { path: "/blog", freq: "weekly", priority: "0.8" },
  { path: "/actualites", freq: "weekly", priority: "0.8" },
  { path: "/contact", freq: "monthly", priority: "0.7" },
  { path: "/legal", freq: "yearly", priority: "0.3" },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        let posts: Array<{ slug: string; updated_at: string | null; published_at: string | null }> = [];
        try {
          const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data } = await supabase
            .from("posts")
            .select("slug, updated_at, published_at")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(5000);
          posts = data ?? [];
        } catch (err) {
          console.error("sitemap posts fetch failed", err);
        }
        const urls = [
          ...STATIC.map(
            (s) => `  <url><loc>${SITE}${s.path}</loc><lastmod>${today}</lastmod><changefreq>${s.freq}</changefreq><priority>${s.priority}</priority></url>`,
          ),
          ...posts.map((p) => {
            const lm = (p.updated_at ?? p.published_at ?? today).slice(0, 10);
            return `  <url><loc>${SITE}/blog/${esc(encodeURIComponent(p.slug))}</loc><lastmod>${lm}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
          }),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
