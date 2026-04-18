import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string | null;
  readTime: number;
  views: number;
};

function mapRow(r: Record<string, unknown>): Post {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    excerpt: (r.excerpt as string) ?? "",
    content: (r.content as string) ?? "",
    coverUrl: (r.cover_url as string) ?? null,
    category: (r.category as string) ?? "Technologie",
    tags: (r.tags as string[]) ?? [],
    author: (r.author as string) ?? "LUBAMA Jean Chrysostome ZACEI",
    publishedAt: (r.published_at as string) ?? null,
    readTime: (r.read_time as number) ?? 5,
    views: (r.views as number) ?? 0,
  };
}

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    },
  });
}
