import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { company } from "@/data/company";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-page grid min-h-[calc(100vh-72px)] items-center gap-12 py-12 lg:grid-cols-5 lg:py-0">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-light px-4 py-1.5 text-xs font-medium text-primary"
          >
            🌍 Présent dans 6 pays — Tchad · Cameroun · RCA · Côte d'Ivoire · France · Belgique
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-bold text-primary md:text-5xl lg:text-[52px]"
          >
            L'intelligence numérique<br />au service de l'Afrique.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Développement web & mobile, plateformes SaaS, agents d'IA — des solutions digitales
            d'excellence pour toutes les institutions, en Afrique francophone et dans le monde.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/services"
              className="rounded-xl bg-primary px-6 py-3 text-center text-[15px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
            >
              Découvrir nos services
            </Link>
            <Link
              to="/portfolio"
              className="rounded-xl border-2 border-primary px-6 py-3 text-center text-[15px] font-semibold text-primary transition-colors hover:bg-primary-light"
            >
              Voir nos réalisations
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-secondary" /> RCCM {company.rccm}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-secondary" /> Attestation ANIE N° 0008290
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-secondary" /> Livraison dans les délais
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:col-span-2 lg:block"
        >
          <div className="relative aspect-square rounded-3xl bg-primary-light p-10 shadow-xl">
            <div className="flex h-full items-end justify-around gap-3">
              {[
                { color: "#1A6B35", h: "55%" },
                { color: "#B83080", h: "78%" },
                { color: "#E88930", h: "92%" },
                { color: "#6DB535", h: "68%" },
              ].map((bar, i) => (
                <motion.div
                  key={i}
                  className="w-full rounded-t-xl"
                  style={{ backgroundColor: bar.color, height: bar.h }}
                  animate={{ scaleY: [1, 1.04, 1] }}
                  transition={{
                    duration: 2.4,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="absolute -right-4 top-8 rounded-xl bg-card px-4 py-3 shadow-lg">
              <div className="font-display text-2xl font-bold text-primary">25+</div>
              <div className="text-xs text-muted-foreground">Projets réalisés</div>
            </div>
            <div className="absolute -left-4 bottom-10 rounded-xl bg-card px-4 py-3 shadow-lg">
              <div className="font-display text-2xl font-bold text-secondary">6</div>
              <div className="text-xs text-muted-foreground">Pays d'intervention</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
