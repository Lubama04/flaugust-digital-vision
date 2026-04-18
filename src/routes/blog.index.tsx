import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, FileText, Clock } from "lucide-react";
import { usePosts } from "@/hooks/usePostsData";
import { FadeInSection } from "@/components/FadeInSection";
import { formatDate } from "@/lib/dateUtils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & Veille — Flaugust Business" },
      {
        name: "description",
        content: "Actualités numériques, tutoriels et analyses pour l'Afrique digitale par Flaugust Business.",
      },
      { property: "og:title", content: "Blog & Veille — Flaugust Business" },
      {
        property: "og:description",
        content: "Articles et analyses sur la transformation numérique africaine.",
      },
    ],
  }),
  component: BlogPage,
});

const CATEGORIES = ["Tous", "Technologie", "IA", "Marketing Digital", "Afrique Numérique", "Formation", "Actualités", "Étude de cas"];

function BlogPage() {
  const { data: posts, isLoading } = usePosts();
  const [cat, setCat] = useState("Tous");

  const filtered = (posts ?? []).filter((p) => cat === "Tous" || p.category === cat);

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="container-page">
          <div className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2">›</span> Blog
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
            Blog & Veille Technologique
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Actualités numériques, tutoriels et analyses pour l'Afrique digitale.
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur md:top-[72px]">
        <div className="container-page py-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:bg-primary-light"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <FadeInSection className="mx-auto max-w-md py-16 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <h2 className="font-display text-2xl font-bold text-primary">
                {posts && posts.length > 0 ? "Aucun article dans cette catégorie." : "Les premiers articles arrivent bientôt."}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {posts && posts.length > 0 ? "Essayez une autre catégorie." : "Revenez nous voir prochainement."}
              </p>
              <Link to="/contact" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-dark">
                Suivre nos actualités
              </Link>
            </FadeInSection>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <FadeInSection key={p.id} delay={i * 0.05}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="aspect-video overflow-hidden bg-primary-light">
                      {p.coverUrl ? (
                        <img src={p.coverUrl} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="grid h-full place-items-center text-primary/30">
                          <FileText className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {p.category}
                      </span>
                      <h3 className="mt-3 line-clamp-2 text-lg font-bold text-foreground">{p.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">{p.author}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {p.readTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
