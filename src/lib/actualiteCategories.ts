export type ActualiteCategoryKey =
  | "Projet"
  | "Événement"
  | "Technologie"
  | "Partenariat"
  | "Formation"
  | "Prix et distinctions"
  | "Autre";

export const ACTUALITE_CATEGORIES: { key: ActualiteCategoryKey; emoji: string; color: string }[] = [
  { key: "Projet", emoji: "🏗️", color: "#7B3415" },
  { key: "Événement", emoji: "📅", color: "#E88930" },
  { key: "Technologie", emoji: "💻", color: "#1A6B35" },
  { key: "Partenariat", emoji: "🤝", color: "#B83080" },
  { key: "Formation", emoji: "🎓", color: "#6DB535" },
  { key: "Prix et distinctions", emoji: "🏆", color: "#D97706" },
  { key: "Autre", emoji: "📦", color: "#6B6B6B" },
];

export function categoryMeta(key: string) {
  return ACTUALITE_CATEGORIES.find((c) => c.key === key) ?? ACTUALITE_CATEGORIES[ACTUALITE_CATEGORIES.length - 1];
}