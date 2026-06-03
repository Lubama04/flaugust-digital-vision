import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Sparkles, Loader2, RefreshCw, Eye, Globe, Smartphone, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { interpretAnalytics } from "@/lib/analytics.functions";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

type Row = { page: string; device: string | null; created_at: string; referrer: string | null };

const COLORS = ["#7B3415", "#E88930", "#1A6B35", "#B83080", "#3B82F6", "#F59E0B"];

function AnalyticsPage() {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [sumLoading, setSumLoading] = useState(false);
  const [sumError, setSumError] = useState<string | null>(null);
  const callInterpret = useServerFn(interpretAnalytics);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - range * 86400_000).toISOString();
      const { data } = await supabase
        .from("page_views")
        .select("page, device, created_at, referrer")
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(50000);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, [range]);

  const { totalViews, uniquePages, topPages, byDevice, trend, byReferrer } = useMemo(() => {
    const pageMap = new Map<string, number>();
    const devMap = new Map<string, number>();
    const dayMap = new Map<string, number>();
    const refMap = new Map<string, number>();
    for (const r of rows) {
      pageMap.set(r.page, (pageMap.get(r.page) ?? 0) + 1);
      const d = r.device ?? "unknown";
      devMap.set(d, (devMap.get(d) ?? 0) + 1);
      const day = r.created_at.slice(0, 10);
      dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
      let ref = "Direct";
      if (r.referrer) {
        try {
          ref = new URL(r.referrer).hostname.replace(/^www\./, "");
        } catch {
          ref = "Autre";
        }
      }
      refMap.set(ref, (refMap.get(ref) ?? 0) + 1);
    }
    return {
      totalViews: rows.length,
      uniquePages: pageMap.size,
      topPages: [...pageMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([page, count]) => ({ page, count })),
      byDevice: [...devMap.entries()].map(([device, count]) => ({ device, count })),
      trend: [...dayMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date: date.slice(5), count })),
      byReferrer: [...refMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([source, count]) => ({ source, count })),
    };
  }, [rows]);

  const generateSummary = async () => {
    setSumLoading(true);
    setSumError(null);
    try {
      const res = await callInterpret({
        data: { totalViews, uniquePages, topPages, byDevice, trend },
      });
      if (res.success) setSummary(res.summary);
      else setSumError(res.error);
    } catch (e) {
      setSumError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSumLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                range === d ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI icon={<Eye className="h-5 w-5" />} label="Vues totales" value={totalViews} color="#7B3415" />
        <KPI icon={<FileText className="h-5 w-5" />} label="Pages uniques" value={uniquePages} color="#1A6B35" />
        <KPI icon={<Smartphone className="h-5 w-5" />} label="Mobile" value={byDevice.find((d) => d.device === "mobile")?.count ?? 0} color="#E88930" />
        <KPI icon={<Globe className="h-5 w-5" />} label="Sources" value={byReferrer.length} color="#B83080" />
      </div>

      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" /> Interprétation IA
          </h2>
          <button
            onClick={generateSummary}
            disabled={sumLoading || loading || totalViews === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-60"
          >
            {sumLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {summary ? "Régénérer" : "Analyser"}
          </button>
        </div>
        {summary ? (
          <p className="text-sm leading-relaxed text-foreground">{summary}</p>
        ) : sumError ? (
          <p className="text-sm text-red-500">{sumError}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Cliquez sur « Analyser » pour obtenir une lecture IA des tendances de fréquentation.
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Visites par jour">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#7B3415" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Top pages">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topPages} layout="vertical" margin={{ left: 70 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" allowDecimals={false} fontSize={11} />
                <YAxis type="category" dataKey="page" fontSize={10} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#E88930" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Appareils">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byDevice} dataKey="count" nameKey="device" outerRadius={90} label>
                  {byDevice.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Sources de trafic">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byReferrer}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="source" fontSize={11} />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#1A6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}

function KPI({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`, color }}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}