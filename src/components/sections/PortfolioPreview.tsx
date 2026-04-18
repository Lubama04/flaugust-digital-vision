import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolioData";
import { FadeInSection } from "@/components/FadeInSection";

export function PortfolioPreview() {
  const { data: items = [] } = usePortfolio();
  const preview = items.slice(0, 3);

  return (
    <section className="bg-background py-20">
      <div className="container-page">
        <FadeInSection className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Réalisations
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
              Ce que nous avons construit
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
          >
            Voir toutes nos réalisations <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInSection>

        <div className="grid gap-5 lg:grid-cols-3">
          {preview.map((p, i) => (
            <FadeInSection key={p.id} delay={i * 0.08}>
              <Link
                to="/portfolio"
                className="group block h-full rounded-xl border-l-4 bg-card p-6 shadow-sm transition-all hover:shadow-lg"
                style={{ borderLeftColor: p.color }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: `${p.color}15`, color: p.color }}
                  >
                    {p.category}
                  </span>
                  <span className="text-lg" aria-hidden>
                    {p.flag}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {p.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.client} · {p.country}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.services.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-foreground/70">{p.challenge}</p>
                {p.results[0] && (
                  <div className="mt-3 flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span className="text-foreground/80">{p.results[0]}</span>
                  </div>
                )}
                <div
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-1"
                  style={{ color: p.color }}
                >
                  Voir le détail <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
