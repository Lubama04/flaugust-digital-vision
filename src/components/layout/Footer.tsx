import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { company } from "@/data/company";
import { services } from "@/data/services";
import logo from "@/assets/logo-flaugust.png";

export function Footer() {
  return (
    <footer className="bg-[oklch(0.18_0.005_50)] text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <div className="font-display text-2xl font-bold text-white">
              Flaugust Business
            </div>
          </div>
          <p className="mb-4 text-sm text-white/60">{company.tagline}</p>
          <p className="mb-5 text-xs text-white/40">RCCM {company.rccm}</p>
          <a
            href={company.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
            </svg>
          </a>
        </div>

        <div>
          <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/", "Accueil"],
              ["/services", "Services"],
              ["/portfolio", "Réalisations"],
              ["/about", "À propos"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white">
            Nos services
          </h4>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  to="/services"
                  hash={s.id}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white">
            Nous contacter
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${company.email}`}
                className="text-white/60 transition-colors hover:text-white"
              >
                {company.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.phone1.replace(/\s/g, "")}`}
                className="text-white/60 transition-colors hover:text-white"
              >
                {company.phone1}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.phone2.replace(/\s/g, "")}`}
                className="text-white/60 transition-colors hover:text-white"
              >
                {company.phone2}
              </a>
            </li>
          </ul>
          <a
            href={company.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 md:flex-row">
          <p>© 2026 Établissement Flaugust Business. Tous droits réservés.</p>
          <Link to="/legal" className="hover:text-white">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
