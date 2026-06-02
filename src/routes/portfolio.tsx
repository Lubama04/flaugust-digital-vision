import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { portfolioCategories, type PortfolioItem } from "@/data/portfolio";
import { usePortfolio } from "@/hooks/usePortfolioData";
import { FadeInSection } from "@/components/FadeInSection";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Réalisations — Flaugust Business" },
      {
        name: "description",
        content:
          "Des projets concrets, des clients réels, des résultats mesurables. ONG, agents IA, SaaS, édition numérique, institutions religieuses.",
      },
      { property: "og:title", content: "Réalisations — Flaugust Business" },
      {
        property: "og:description",
        content: "Portfolio de projets institutionnels en Afrique francophone.",
      },
      { property: "og:url", content: "https://www.flaugustbusiness.com/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://www.flaugustbusiness.com/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [active, setActive] = useState<string>("Tous");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const { data: portfolioItems = [] } = usePortfolio();

  const filtered =
    active === "Tous"
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === active);

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="container-page">
          <div className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>{" "}
            <span className="mx-2">›</span> Réalisations
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
            Réalisations
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Des projets concrets, des clients réels, des résultats mesurables.
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur md:top-[72px]">
        <div className="container-page flex flex-wrap gap-2 py-3">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-primary-light"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-background py-12">
        <div className="container-page space-y-6">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center text-muted-foreground">
              Aucun projet dans cette catégorie pour le moment.
            </div>
          ) : (
            filtered.map((p, i) => (
              <FadeInSection key={p.id} delay={i * 0.05}>
                <button
                  onClick={() => setSelected(p)}
                  className="group flex w-full overflow-hidden rounded-xl bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div
                    className="w-2 shrink-0 transition-all group-hover:w-3"
                    style={{ backgroundColor: p.color }}
                    aria-hidden
                  />
                  <div className="grid flex-1 md:grid-cols-12">
                    <div
                      className="space-y-3 p-6 md:col-span-4"
                      style={{ backgroundColor: `${p.color}0D` }}
                    >
                      <span
                        className="inline-block rounded-full px-3 py-1 text-[11px] font-bold text-white"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden>
                          {p.flag}
                        </span>
                        <span className="font-bold text-foreground">{p.country}</span>
                      </div>
                      <p className="text-xs italic text-muted-foreground">{p.client}</p>
                      <span className="inline-block rounded-md bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground/70">
                        {p.year}
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {p.stack.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-foreground/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 p-6 md:col-span-8">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                        <ArrowRight
                          className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
                          style={{ color: p.color }}
                        />
                      </div>
                      <p className="text-sm">
                        <span className="font-bold text-primary">Défi : </span>
                        <span className="text-foreground/80">{p.challenge}</span>
                      </p>
                      <p className="line-clamp-2 text-sm">
                        <span className="font-bold text-secondary">Solution : </span>
                        <span className="text-foreground/80">{p.solution}</span>
                      </p>
                      <div>
                        <div className="mb-2 text-sm font-bold text-accent">Résultats :</div>
                        <ul className="grid gap-1.5 sm:grid-cols-2">
                          {p.results.map((r) => (
                            <li
                              key={r}
                              className="flex items-start gap-1.5 text-xs text-foreground/80"
                            >
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div
                        className="inline-flex items-center gap-1 pt-1 text-sm font-semibold"
                        style={{ color: p.color }}
                      >
                        En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </button>
              </FadeInSection>
            ))
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

function DetailModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-foreground/60 p-4 backdrop-blur-sm md:items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-card shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground shadow-md hover:bg-background"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="h-3" style={{ backgroundColor: item.color }} aria-hidden />
        <div className="space-y-5 p-7 md:p-9">
          <div>
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-bold text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.category}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
              {item.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{item.flag} {item.country}</span>
              <span>·</span>
              <span className="italic">{item.client}</span>
              <span>·</span>
              <span>{item.year}</span>
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Défi
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">{item.challenge}</p>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
              Solution
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">{item.solution}</p>
          </div>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
              Résultats
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {item.results.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 border-t border-border pt-5 md:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Services
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-muted px-2 py-1 text-[11px] text-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Stack technique
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-primary-light p-4 text-center">
            <p className="text-sm text-foreground/80">
              Vous avez un projet similaire ?{" "}
              <Link to="/contact" className="font-bold text-primary underline">
                Contactez-nous →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
