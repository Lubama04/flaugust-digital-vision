import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import DOMPurify from "isomorphic-dompurify";
import { ChevronLeft, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/dateUtils";

const DEFAULT_OG_IMAGE = "https://www.flaugustbusiness.com/logo-flaugust.png";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { post: data };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Article — Flaugust Business" }] };
    const url = `https://www.flaugustbusiness.com/blog/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} — Flaugust Business` },
        { name: "description", content: post.excerpt ?? "" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: post.cover_url || DEFAULT_OG_IMAGE },
        { name: "twitter:image", content: post.cover_url || DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.cover_url || DEFAULT_OG_IMAGE,
            datePublished: post.published_at ?? undefined,
            dateModified: post.updated_at ?? post.published_at ?? undefined,
            author: { "@type": "Person", name: post.author },
            mainEntityOfPage: url,
          }).replace(/</g, "\\u003c"),
        },
      ],
    };
  },
  errorComponent: ({ error }) => {
    if (import.meta.env.DEV) console.error("Blog post error:", error);
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Article introuvable</h1>
        <p className="mt-2 text-muted-foreground">Une erreur est survenue. Veuillez réessayer plus tard.</p>
        <Link to="/blog" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">← Retour au blog</Link>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl text-primary">Article introuvable</h1>
      <Link to="/blog" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">← Retour au blog</Link>
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const cleanHtml = DOMPurify.sanitize(post.content ?? "", { USE_PROFILES: { html: true } });

  return (
    <article className="bg-background pb-20">
      <div className="container-page max-w-3xl py-8">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Retour au blog
        </Link>
      </div>

      {post.cover_url && (
        <div className="container-page max-w-3xl">
          <img src={post.cover_url} alt={post.title} className="aspect-video w-full rounded-2xl object-cover" />
        </div>
      )}

      <div className="container-page mt-8 max-w-3xl">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{post.category}</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-primary md:text-5xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>Par {post.author}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.read_time} min</span>
        </div>
        {post.excerpt && <p className="mt-6 text-lg italic text-muted-foreground">{post.excerpt}</p>}
        <div
          className="prose prose-lg mt-10 max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>
    </article>
  );
}
