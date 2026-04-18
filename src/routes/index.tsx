import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { StatsSection } from "@/components/sections/StatsSection";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { WhyFlaugust } from "@/components/sections/WhyFlaugust";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flaugust Business — Solutions Numériques pour l'Afrique" },
      {
        name: "description",
        content:
          "Développement web, SaaS, agents IA pour gouvernements, ONG, institutions et entreprises. Tchad, Afrique centrale, monde.",
      },
      {
        property: "og:title",
        content: "Flaugust Business — Solutions Numériques pour l'Afrique",
      },
      {
        property: "og:description",
        content:
          "Développement web, SaaS, agents IA pour gouvernements, ONG, institutions et entreprises.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesOverview />
      <WhyFlaugust />
      <PortfolioPreview />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
