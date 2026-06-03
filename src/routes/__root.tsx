import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";

// ============================================================
// MÉTADONNÉES SEO racine — valeurs par défaut sitewide.
// Les titres / descriptions / og:url / canonical spécifiques
// à chaque page sont définis dans les routes individuelles.
// ============================================================
const SEO_TITLE = "Flaugust Business — Solutions numériques pour l'Afrique";
const SEO_DESCRIPTION =
  "Flaugust Business, entreprise tchadienne : développement web, SaaS, agents IA, formation et conseil pour les institutions africaines.";
const SEO_KEYWORDS =
  "développement web, SaaS, intelligence artificielle, formation, transformation digitale, Afrique, Tchad, institutions";
const SEO_AUTHOR = "LUBAMA Jean Chrysostome ZACEI";
const SITE_URL = "https://www.flaugustbusiness.com";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: `google-site-verification`, content: `8DXYz7C4pCgYJ7VVe1Z3YWrIfKbA0FpvbFoyCZQq4mc` },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "author", content: SEO_AUTHOR },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Flaugust Business" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESCRIPTION },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
        media: "print",
        onload: "this.media='all'",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Flaugust Business",
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.ico`,
          founder: { "@type": "Person", name: SEO_AUTHOR },
          areaServed: "Africa",
          sameAs: [],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Flaugust Business",
          url: SITE_URL,
          inLanguage: "fr-FR",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    if (typeof window === "undefined") return;
    try {
      const w = window.innerWidth;
      const device = w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
      supabase
        .from("page_views")
        .insert({
          page: location.pathname,
          referrer: document.referrer || null,
          device,
        })
        .then(() => {})
        .then(undefined, () => {});
    } catch {
      // ignore tracking errors
    }
  }, [location.pathname, isAdmin]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {isAdmin ? (
          <>
            <Outlet />
            <Toaster richColors position="top-right" />
          </>
        ) : (
          <>
            <Navbar />
            <main className="pt-16 md:pt-[72px]">
              <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
            <ScrollToTop />
            <Toaster richColors position="top-right" />
          </>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
