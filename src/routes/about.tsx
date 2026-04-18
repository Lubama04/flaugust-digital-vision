import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { company } from "@/data/company";
import { FadeInSection } from "@/components/FadeInSection";
import founderPhoto from "@/assets/founder-lubama.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Flaugust Business" },
      {
        name: "description",
        content:
          "Établissement Flaugust Business : fondé en 2024 au Tchad, RCCM TD-SRH-2024-A-140. Notre mission, notre fondateur et nos valeurs.",
      },
      { property: "og:title", content: "À propos — Flaugust Business" },
      {
        property: "og:description",
        content:
          "Notre histoire, notre fondateur LUBAMA Jean Chrysostome ZACEI et nos valeurs.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="container-page">
          <div className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>{" "}
            <span className="mx-2">›</span> À propos
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
            À propos
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Une entreprise tchadienne au service de la transformation numérique africaine.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-background py-20">
        <FadeInSection className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Notre histoire
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              Une vision : l'excellence numérique africaine
            </h2>
            <p className="mt-5 text-muted-foreground">
              {company.mission}
            </p>
            <p className="mt-4 text-muted-foreground">
              Notre vision : <span className="font-semibold text-primary">{company.vision}</span>
            </p>
            <p className="mt-4 text-muted-foreground">
              Fondé en 2024 à Sarh, Établissement Flaugust Business est officiellement enregistré
              au Registre du Commerce et du Crédit Mobilier du Tchad et reconnu par l'Agence
              Nationale des Investissements (ANIE).
            </p>
          </div>
          <div className="space-y-6">
            {[
              { year: "2024", text: "Fondation de Flaugust Business à Sarh, Tchad" },
              { year: "2024", text: "Premier agent IA déployé : FLAUGUST INTEL" },
              { year: "2025–2026", text: "25+ projets livrés dans 6 pays" },
            ].map((m, i) => (
              <div key={i} className="relative pl-8">
                <span className="absolute left-0 top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="absolute left-2 top-7 h-full w-px bg-border last:hidden" />
                <div className="font-display text-xl font-bold text-primary">{m.year}</div>
                <p className="mt-1 text-foreground/80">{m.text}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Founder */}
      <section className="bg-card py-16">
        <FadeInSection className="container-page grid gap-10 lg:grid-cols-3">
          <div>
            <div className="overflow-hidden rounded-2xl bg-primary-light shadow-lg">
              <img
                src={founderPhoto}
                alt="LUBAMA Jean Chrysostome ZACEI, fondateur de Flaugust Business"
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {company.founder}
            </h2>
            <span className="mt-2 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
              {company.founderTitle}
            </span>
            <p className="mt-5 text-muted-foreground">{company.founderBio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["React", "TypeScript", "Supabase", "Agents IA", "Next.js", "Python"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-background px-3 py-1 font-mono text-xs text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Values */}
      <section className="bg-background py-20">
        <FadeInSection className="container-page">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            Nos valeurs fondamentales
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {company.values.map((v, i) => (
              <div
                key={v.title}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-7"
              >
                <span className="pointer-events-none absolute -right-3 -top-6 font-display text-8xl font-bold text-primary/10">
                  0{i + 1}
                </span>
                <div className="relative">
                  <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Legal */}
      <section className="bg-primary-light py-12">
        <FadeInSection className="container-page">
          <h2 className="text-center font-display text-2xl font-bold text-primary md:text-3xl">
            Reconnaissance légale
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="font-bold text-foreground">
                Registre du Commerce et du Crédit Mobilier
              </h3>
              <p className="mt-2 font-mono text-sm text-primary">N° {company.rccm}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Greffe de Sarh, Tchad — 09 août 2024
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
                <Check className="h-3 w-3" /> Enregistrement officiel
              </span>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="font-bold text-foreground">
                Agence Nationale des Investissements
              </h3>
              <p className="mt-2 font-mono text-sm text-primary">{company.anie}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Valide du 08/08/2024 au 07/08/2029
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
                <Check className="h-3 w-3" /> Attestation valide
              </span>
            </div>
          </div>
          <p className="mt-5 text-center text-xs italic text-muted-foreground">
            Ces documents sont disponibles sur demande.
          </p>
        </FadeInSection>
      </section>

      {/* Geo */}
      <section className="bg-background py-16">
        <FadeInSection className="container-page text-center">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Zone d'intervention
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Présents en Afrique centrale et au-delà, nous intervenons partout sur le continent
            africain et à l'international.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: "🌍", label: "Afrique — Siège au Tchad, interventions continent entier" },
              { icon: "🌐", label: "International — Europe, Amériques et monde entier" },
            ].map((c) => (
              <span
                key={c.label}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground/80"
              >
                <span className="mr-2 text-lg">{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
