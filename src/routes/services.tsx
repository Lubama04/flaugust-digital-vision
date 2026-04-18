import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { FadeInSection } from "@/components/FadeInSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services — Flaugust Business" },
      {
        name: "description",
        content:
          "Six piliers d'expertise : développement web & mobile, SaaS, agents IA, marketing digital, services institutionnels, conseil et formation.",
      },
      { property: "og:title", content: "Nos services — Flaugust Business" },
      {
        property: "og:description",
        content:
          "Développement web, SaaS, agents IA, marketing digital pour institutions africaines.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <>
      <PageHeader />
      {services.map((s, i) => {
        const Icon = s.icon;
        const alt = i % 2 === 1;
        return (
          <section
            key={s.id}
            id={s.id}
            className={`scroll-mt-24 py-16 md:py-20 ${alt ? "bg-background" : "bg-card"}`}
          >
            <FadeInSection className="container-page grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div
                  className="grid h-16 w-16 place-items-center rounded-2xl"
                  style={{ backgroundColor: `${s.color}20`, color: s.color }}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}
                >
                  {s.badge}
                </span>
                <div
                  className="mt-6 h-[120px] w-1"
                  style={{ backgroundColor: s.color }}
                  aria-hidden
                />
              </div>
              <div className="lg:col-span-8">
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{s.fullDesc}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: s.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.sectors.map((sec) => (
                    <span
                      key={sec}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/70"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: s.color }}
                >
                  Nous contacter pour ce service <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeInSection>
          </section>
        );
      })}
    </>
  );
}

function PageHeader() {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="container-page">
        <div className="text-sm text-white/70">
          <Link to="/" className="hover:text-white">
            Accueil
          </Link>{" "}
          <span className="mx-2">›</span> Services
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
          Nos services
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/80">
          Six piliers d'expertise numérique au service de toutes vos institutions.
        </p>
      </div>
    </section>
  );
}
