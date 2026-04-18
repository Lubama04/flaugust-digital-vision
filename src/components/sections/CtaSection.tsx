import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { company } from "@/data/company";
import { FadeInSection } from "@/components/FadeInSection";

export function CtaSection() {
  return (
    <section className="bg-gradient-to-br from-primary-dark to-primary py-20 text-white">
      <FadeInSection className="container-page text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white md:text-4xl">
          Prêt à transformer votre institution ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Discutons de votre projet. Réponse garantie dans les 24 heures.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/contact"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02]"
          >
            Démarrer un projet
          </Link>
          <a
            href={`tel:${company.phone1.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-4 w-4" /> Nous appeler directement
          </a>
        </div>
      </FadeInSection>
    </section>
  );
}
