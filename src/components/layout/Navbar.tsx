import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-flaugust.png";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Réalisations" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-[72px]">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Logo Flaugust Business"
            className="h-10 w-10 object-contain md:h-11 md:w-11"
          />
          <span className="font-display text-lg font-bold text-primary">
            Flaugust Business
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative text-[15px] text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full data-[status=active]:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Nous contacter
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              style={{ backgroundColor: "var(--primary)" }}
              className="fixed inset-y-0 right-0 z-[100] flex h-screen w-[78vw] max-w-[320px] flex-col overflow-y-auto shadow-2xl lg:hidden"
            >
            <div className="container-page flex h-16 items-center justify-between md:h-[72px]">
              <div className="flex items-center gap-2">
                <img src={logo} alt="" className="h-8 w-8 object-contain" />
                <span className="font-display text-lg font-bold text-primary-foreground">
                  Flaugust Business
                </span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fermer">
                <X className="h-6 w-6 text-primary-foreground" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-0 px-6 pt-8">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="w-full border-b border-primary-foreground/20 py-5 text-center text-xl text-primary-foreground/90 hover:text-primary-foreground"
                  activeProps={{ className: "text-primary-foreground font-semibold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-8 w-full rounded-lg bg-primary-foreground py-4 text-center font-semibold text-primary"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
