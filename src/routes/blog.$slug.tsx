import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import { ChevronLeft, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/dateUtils";

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
    return {
      meta: [
        { title: `${post.title} — Flaugust Business` },
        { name: "description", content: post.excerpt ?? "" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt ?? "" },
        ...(post.cover_url ? [{ property: "og:image", content: post.cover_url }, { name: "twitter:image", content: post.cover_url }] : []),
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl text-primary">Article introuvable</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Link to="/blog" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">← Retour au blog</Link>
    </div>
  ),
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
  const cleanHtml = typeof window !== "undefined" ? DOMPurify.sanitize(post.content ?? "") : (post.content ?? "");

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
