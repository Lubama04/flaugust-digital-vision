import { Wrench, Globe2, Zap } from "lucide-react";
import { company } from "@/data/company";
import { FadeInSection } from "@/components/FadeInSection";

const points = [
  { icon: Wrench, text: "Technologies de pointe — React, TypeScript, Supabase, agents IA" },
  { icon: Globe2, text: "Ancrage africain — Solutions adaptées aux contraintes terrain" },
  { icon: Zap, text: "Livraison rapide — De l'idée au déploiement en quelques semaines" },
];

export function WhyFlaugust() {
  return (
    <section className="bg-card py-20">
      <div className="container-page grid gap-12 lg:grid-cols-5">
        <FadeInSection className="lg:col-span-3">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Pourquoi nous choisir
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            L'expertise africaine au standard mondial
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Nous combinons la maîtrise technique des meilleurs standards internationaux avec une
            compréhension intime des réalités africaines : connectivité, mobile money,
            institutions, langues locales.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-light text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-foreground">{p.text}</span>
                </li>
              );
            })}
          </ul>
        </FadeInSection>

        <FadeInSection delay={0.15} className="lg:col-span-2">
          <div className="space-y-5">
            {company.values.map((v, i) => (
              <div
                key={v.title}
                className="relative overflow-hidden rounded-xl border border-border bg-background p-5"
              >
                <span className="pointer-events-none absolute -right-2 -top-4 font-display text-7xl font-bold text-primary/10">
                  0{i + 1}
                </span>
                <div className="relative">
                  <h3 className="font-bold text-foreground">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
