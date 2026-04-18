import { useInView } from "framer-motion";
import { useRef } from "react";
import { stats } from "@/data/stats";
import { useCounter } from "@/hooks/useCounter";

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(value, 2000, inView);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl font-bold text-white md:text-6xl">
        {count}
        {suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.15em] text-white/75">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-primary py-16">
      <div className="container-page grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-white/20">
        {stats.map((s) => (
          <div key={s.label} className="md:px-4">
            <StatItem value={s.value} suffix={s.suffix} label={s.label} />
          </div>
        ))}
      </div>
    </section>
  );
}
