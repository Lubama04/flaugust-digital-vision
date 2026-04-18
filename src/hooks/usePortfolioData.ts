import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { portfolioItems, type PortfolioItem } from "@/data/portfolio";

export type PortfolioRow = PortfolioItem & {
  slug: string;
  published: boolean;
  sortOrder: number;
};

function mapRow(row: Record<string, unknown>): PortfolioRow {
  return {
    id: (row.slug as string) ?? (row.id as string),
    slug: (row.slug as string) ?? "",
    title: (row.title as string) ?? "",
    category: (row.category as string) ?? "",
    categoryColor: (row.category_color as string) ?? "#7B3415",
    client: (row.client as string) ?? "",
    country: (row.country as string) ?? "",
    flag: (row.flag as string) ?? "",
    year: (row.year as string) ?? "",
    services: (row.services as string[]) ?? [],
    stack: (row.stack as string[]) ?? [],
    challenge: (row.challenge as string) ?? "",
    solution: (row.solution as string) ?? "",
    results: (row.results as string[]) ?? [],
    color: (row.color as string) ?? "#7B3415",
    imageUrl: (row.image_url as string) ?? null,
    published: (row.published as boolean) ?? true,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

const fallback: PortfolioRow[] = portfolioItems.map((p, i) => ({
  ...p,
  slug: p.id,
  published: true,
  sortOrder: i,
}));

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async (): Promise<PortfolioRow[]> => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return fallback;
      return data.map(mapRow);
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallback,
  });
}
