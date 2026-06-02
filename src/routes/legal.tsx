import { createFileRoute, Link } from "@tanstack/react-router";
import { company } from "@/data/company";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Flaugust Business" },
      {
        name: "description",
        content: "Mentions légales et informations sur Établissement Flaugust Business.",
      },
      { property: "og:title", content: "Mentions légales — Flaugust Business" },
      { property: "og:description", content: "Mentions légales de Flaugust Business." },
      { property: "og:url", content: "https://www.flaugustbusiness.com/legal" },
    ],
    links: [{ rel: "canonical", href: "https://www.flaugustbusiness.com/legal" }],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="container-page">
          <div className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>{" "}
            <span className="mx-2">›</span> Mentions légales
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
            Mentions légales
          </h1>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page mx-auto max-w-3xl space-y-10 text-foreground/85">
          <Block title="1. Éditeur du site">
            <p>
              <strong>{company.fullName}</strong>
              <br />
              Fondateur : {company.founder}
              <br />
              Email :{" "}
              <a className="text-primary underline" href={`mailto:${company.email}`}>
                {company.email}
              </a>
              <br />
              Téléphone : {company.phone1} — {company.phone2}
              <br />
              Adresse : {company.address1} | {company.address2}
            </p>
          </Block>
          <Block title="2. Informations légales">
            <p>
              <strong>RCCM :</strong> {company.rccm} (Greffe de Sarh, Tchad)
              <br />
              <strong>ANIE :</strong> {company.anie}
              <br />
              <strong>Activité :</strong> Développement de logiciels, services numériques,
              conseil en transformation digitale.
            </p>
          </Block>
          <Block title="3. Hébergement">
            <p>
              Le site est hébergé sur infrastructure cloud sécurisée. Les détails techniques
              de l'hébergeur peuvent être obtenus sur simple demande à l'adresse {company.email}.
            </p>
          </Block>
          <Block title="4. Propriété intellectuelle">
            <p>
              L'ensemble des contenus (textes, images, logos, code source) présents sur ce site
              est la propriété exclusive de {company.fullName}, sauf mention contraire. Toute
              reproduction, représentation ou diffusion sans autorisation préalable écrite est
              strictement interdite.
            </p>
          </Block>
          <Block title="5. Données personnelles">
            <p>
              Les données collectées via le formulaire de contact sont utilisées uniquement
              pour répondre à vos demandes. Aucune donnée n'est cédée à des tiers. Vous
              disposez d'un droit d'accès, de rectification et de suppression de vos données
              personnelles, exerçable par email auprès du DPO.
            </p>
          </Block>
          <Block title="6. Contact DPO">
            <p>
              Délégué à la protection des données :{" "}
              <a className="text-primary underline" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-primary md:text-2xl">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </div>
  );
}
