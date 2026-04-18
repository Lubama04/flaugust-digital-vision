import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { FadeInSection } from "@/components/FadeInSection";

export function ServicesOverview() {
  return (
    <section className="bg-background py-20">
      <div className="container-page">
        <FadeInSection className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Nos services
            </div>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold text-foreground md:text-4xl">
              Des solutions numériques pour chaque besoin
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Nous intervenons sur l'ensemble de la chaîne numérique, de la conception à la
              maintenance, pour toutes les institutions.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
          >
            Voir tous nos services <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInSection>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeInSection key={s.id} delay={i * 0.05}>
                <Link
                  to="/services"
                  hash={s.id}
                  className="group block h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-xl"
                      style={{ backgroundColor: `${s.color}20`, color: s.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: `${s.color}15`, color: s.color }}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.shortDesc}
                  </p>
                  <div
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-1"
                    style={{ color: s.color }}
                  >
                    En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
