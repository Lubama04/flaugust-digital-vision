import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { StatsSection } from "@/components/sections/StatsSection";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flaugust Business — Solutions Numériques pour l'Afrique" },
      {
        name: "description",
        content:
          "Développement web, SaaS, agents IA pour gouvernements, ONG, institutions et entreprises. Présents en Afrique et à l'international.",
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
      { property: "og:url", content: "https://www.flaugustbusiness.com/" },
    ],
    links: [{ rel: "canonical", href: "https://www.flaugustbusiness.com/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesOverview />
      <PortfolioPreview />
      <CtaSection />
    </>
  );
}
