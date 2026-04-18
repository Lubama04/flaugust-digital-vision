import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

import appCss from "../styles.css?url";

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
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `Flaugust Business — Solutions Numériques, Formation & Commerce` },
      {
        name: "description",
        content: `Portail officiel de Flaugust Business — l'entreprise tchadienne qui place l'excellence numérique au service de toutes les institutions. Votre partenaire de confiance pour la transformation digitale, la formation et le commerce, en Afrique et dans le monde.`,
      },
      { name: "author", content: "LUBAMA Jean Chrysostome ZACEI" },
      {
        name: "keywords",
        content:
          "développement web, applications mobiles, SaaS, intelligence artificielle, formation, gestion de projets, import-export, transformation digitale, Afrique, Tchad, institutions",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.flaugustbusiness.com" },
      { property: "og:site_name", content: "Flaugust Business" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: `Flaugust Business — Solutions Numériques, Formation & Commerce` },
      {
        property: "og:description",
        content: `Portail officiel de Flaugust Business — l'entreprise tchadienne qui place l'excellence numérique au service de toutes les institutions. Votre partenaire de confiance pour la transformation digitale, la formation et le commerce, en Afrique et dans le monde.`,
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0ea9f739-7c6f-4f56-b0cf-ed8e948337a5",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Flaugust Business — Solutions Numériques, Formation & Commerce` },
      {
        name: "twitter:description",
        content: `Portail officiel de Flaugust Business — l'entreprise tchadienne qui place l'excellence numérique au service de toutes les institutions.`,
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0ea9f739-7c6f-4f56-b0cf-ed8e948337a5",
      },
      { title: "Flaugust Business — Solutions numériques pour l'Afrique" },
      { property: "og:title", content: "Flaugust Business — Solutions numériques pour l'Afrique" },
      { name: "twitter:title", content: "Flaugust Business — Solutions numériques pour l'Afrique" },
      { name: "description", content: "Portail officiel de Flaugust Business — l'entreprise 
tchadienne qui place l'excellence numérique au service 
de toutes les institutions." },
      { property: "og:description", content: "Portail officiel de Flaugust Business — l'entreprise 
tchadienne qui place l'excellence numérique au service 
de toutes les institutions." },
      { name: "twitter:description", content: "Portail officiel de Flaugust Business — l'entreprise 
tchadienne qui place l'excellence numérique au service 
de toutes les institutions." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0ea9f739-7c6f-4f56-b0cf-ed8e948337a5" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0ea9f739-7c6f-4f56-b0cf-ed8e948337a5" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
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
