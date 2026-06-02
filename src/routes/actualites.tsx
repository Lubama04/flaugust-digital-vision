import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2, Megaphone, ChevronLeft, ChevronRight, X } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { supabase } from "@/integrations/supabase/client";
import { ACTUALITE_CATEGORIES, categoryMeta } from "@/lib/actualiteCategories";
import { formatDate } from "@/lib/dateUtils";
import { FadeInSection } from "@/components/FadeInSection";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités — Flaugust Business" },
      {
        name: "description",
        content:
          "Dernières nouvelles de Flaugust Business : projets, événements, partenariats, technologies et formations en Afrique.",
      },
      { property: "og:title", content: "Actualités — Flaugust Business" },
      {
        property: "og:description",
        content: "Dernières nouvelles de Flaugust Business — projets, événements et partenariats.",
      },
      { property: "og:url", content: "https://www.flaugustbusiness.com/actualites" },
    ],
    links: [{ rel: "canonical", href: "https://www.flaugustbusiness.com/actualites" }],
  }),
  component: ActualitesPage,
});

type Actualite = {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  category: string;
  custom_category: string | null;
  images_urls: string[] | null;
  published_at: string | null;
  created_at: string;
};

const SITE_URL = "https://www.flaugustbusiness.com";

function ActualitesPage() {
  const [items, setItems] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("Toutes");
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("actualites")
        .select("id,title,content,excerpt,category,custom_category,images_urls,published_at,created_at")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      setItems((data as Actualite[]) ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  const filtered = useMemo(
    () => (filter === "Toutes" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="container-page">
          <div className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2">›</span> Actualités
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">Actualités</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Dernières nouvelles de Flaugust Business — projets, événements, partenariats et plus.
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur md:top-[72px]">
        <div className="container-page py-3">
          <div className="flex flex-wrap gap-2">
            <FilterPill active={filter === "Toutes"} onClick={() => setFilter("Toutes")}>
              Toutes
            </FilterPill>
            {ACTUALITE_CATEGORIES.map((c) => (
              <FilterPill
                key={c.key}
                active={filter === c.key}
                color={c.color}
                onClick={() => setFilter(c.key)}
              >
                {c.emoji} {c.key}
              </FilterPill>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <Megaphone className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <h2 className="font-display text-2xl font-bold text-primary">
                {items.length === 0
                  ? "Les premières actualités arrivent bientôt."
                  : "Aucune actualité dans cette catégorie pour le moment."}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {items.length === 0 ? "Revenez nous voir prochainement." : "Essayez une autre catégorie."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a, i) => (
                <FadeInSection key={a.id} delay={i * 0.05}>
                  <ActualiteCard actualite={a} onOpenLightbox={setLightbox} />
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={(idx) => setLightbox((prev) => (prev ? { ...prev, index: idx } : prev))}
        />
      )}
    </>
  );
}

function FilterPill({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
      style={
        active
          ? { backgroundColor: color ?? "var(--primary)", color: "white", borderColor: color ?? "var(--primary)" }
          : { borderColor: "var(--border)", color: "var(--muted-foreground)", backgroundColor: "transparent" }
      }
    >
      {children}
    </button>
  );
}

function ActualiteCard({
  actualite,
  onOpenLightbox,
}: {
  actualite: Actualite;
  onOpenLightbox: (state: { images: string[]; index: number }) => void;
}) {
  const meta = categoryMeta(actualite.category);
  const images = actualite.images_urls ?? [];
  const label =
    actualite.category === "Autre" && actualite.custom_category
      ? actualite.custom_category
      : actualite.category;
  const date = formatDate(actualite.published_at ?? actualite.created_at);

  const shareUrl = `${SITE_URL}/actualites#${actualite.id}`;
  const shareText = `${actualite.title} — Flaugust Business`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const cleanContent = useMemo(
    () =>
      DOMPurify.sanitize(actualite.excerpt || actualite.content || "", {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "a", "ul", "ol", "li", "h3", "h4"],
        ALLOWED_ATTR: ["href", "target", "rel"],
      }),
    [actualite.content, actualite.excerpt],
  );

  return (
    <article
      id={actualite.id}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {images.length > 0 && (
        <ImageGallery images={images} onOpen={(idx) => onOpenLightbox({ images, index: idx })} />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ backgroundColor: meta.color }}
          >
            {meta.emoji} {label}
          </span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-lg font-bold text-foreground">{actualite.title}</h2>
        <div
          className="mt-2 line-clamp-3 text-sm text-muted-foreground [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <time>{date}</time>
          <div className="flex items-center gap-1.5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur WhatsApp"
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--lime)_15%,transparent)] hover:text-[var(--lime)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M12 .04C5.46.04.16 5.34.16 11.88c0 2.09.55 4.13 1.59 5.93L.05 24l6.32-1.66a11.84 11.84 0 0 0 5.63 1.43h.01c6.54 0 11.84-5.3 11.85-11.84 0-3.17-1.23-6.15-3.47-8.4A11.78 11.78 0 0 0 12 .04Zm0 21.57h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.74.98 1-3.65-.24-.38a9.83 9.83 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.97c0 5.43-4.42 9.83-9.84 9.83Z" />
              </svg>
            </a>
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur LinkedIn"
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function ImageGallery({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (idx: number) => void;
}) {
  if (images.length === 1) {
    return (
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="block aspect-video w-full overflow-hidden bg-muted"
      >
        <img
          src={images[0]}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </button>
    );
  }

  if (images.length <= 3) {
    return (
      <div className="grid h-48 grid-cols-2 gap-0.5 overflow-hidden bg-muted">
        {images.slice(0, 2).map((url, idx) => (
          <button
            type="button"
            key={url + idx}
            onClick={() => onOpen(idx)}
            className="overflow-hidden"
          >
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  }

  // 4+
  const showCount = 4;
  const extra = images.length - showCount;
  return (
    <div className="grid h-56 grid-cols-3 grid-rows-2 gap-0.5 overflow-hidden bg-muted">
      {images.slice(0, showCount).map((url, idx) => {
        const isLast = idx === showCount - 1 && extra > 0;
        return (
          <button
            type="button"
            key={url + idx}
            onClick={() => onOpen(idx)}
            className={`relative overflow-hidden ${idx === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            {isLast && (
              <span className="absolute inset-0 grid place-items-center bg-black/55 text-base font-bold text-white">
                +{extra} {extra === 1 ? "autre" : "autres"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (idx: number) => void;
}) {
  const prev = useCallback(() => {
    onChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % images.length);
  }, [index, images.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Fermer"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}