import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { FadeInSection } from "@/components/FadeInSection";

export function TestimonialsSection() {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="container-page">
        <FadeInSection className="mb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
            Ils nous font confiance
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Ce que disent nos clients
          </h2>
        </FadeInSection>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeInSection key={t.name + i} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full font-bold text-white"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-[15px] italic leading-relaxed text-white/90">"{t.text}"</p>
                <div className="mt-5 border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/60">
                    {t.org} · {t.country}
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
