import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stats as fallbackStats } from "@/data/stats";

export type StatItem = { value: number; suffix: string; label: string };

const fallback: StatItem[] = fallbackStats.map((s) => ({
  value: s.value,
  suffix: s.suffix,
  label: s.label,
}));

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async (): Promise<StatItem[]> => {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return fallback;
      return data.map((r) => ({
        value: r.value,
        suffix: r.suffix ?? "",
        label: r.label,
      }));
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallback,
  });
}
