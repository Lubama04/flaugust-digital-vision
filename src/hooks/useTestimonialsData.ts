import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testimonials as fallbackList } from "@/data/testimonials";

export type Testimonial = {
  id: string;
  name: string;
  org: string;
  country: string;
  text: string;
  rating: number;
  avatar: string;
  color: string;
};

const fallback: Testimonial[] = fallbackList.map((t, i) => ({
  id: String(i),
  name: t.name,
  org: t.org,
  country: t.country,
  text: t.text,
  rating: t.rating,
  avatar: t.avatar,
  color: t.color,
}));

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return fallback;
      return data.map((r) => ({
        id: r.id,
        name: r.name,
        org: r.org ?? "",
        country: r.country ?? "",
        text: r.text,
        rating: r.rating,
        avatar: r.avatar ?? r.name.charAt(0),
        color: r.color ?? "#7B3415",
      }));
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallback,
  });
}
