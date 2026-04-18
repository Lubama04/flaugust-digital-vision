export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  client: string;
  country: string;
  flag: string;
  year: string;
  services: string[];
  stack: string[];
  challenge: string;
  solution: string;
  results: string[];
  color: string;
  imageUrl?: string | null;
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "prodiges",
    title: "PRODIGES Bien-être & Environnement",
    category: "ONG",
    categoryColor: "#1A6B35",
    client: "PRODIGES Bien-être et Environnement",
    country: "République Centrafricaine",
    flag: "🇨🇫",
    year: "2024",
    services: [
      "Agent IA de financement",
      "Veille multi-sources",
      "Site web institutionnel (en cours)",
    ],
    stack: ["Twin.so", "React", "TypeScript", "Supabase"],
    challenge:
      "L'ONG PRODIGES avait besoin d'un outil automatisé pour identifier les opportunités de financement parmi plus de 60 sources internationales, et d'une présence numérique professionnelle pour renforcer sa crédibilité.",
    solution:
      "Nous avons déployé PRODIGES INTEL, un agent IA autonome et pleinement opérationnel qui scanne les bases de données de financement en 8 langues, génère des propositions de financement prêtes à soumettre et envoie des rapports hebdomadaires directement par email. Le site web institutionnel de l'ONG est actuellement en cours de développement.",
    results: [
      "Agent IA PRODIGES INTEL opérationnel et fonctionnel",
      "60+ sources de financement scannées automatiquement",
      "Rapports de veille livrés chaque semaine par email",
      "Propositions de financement générées automatiquement",
      "Site institutionnel en cours de développement",
    ],
    color: "#1A6B35",
    imageUrl: null,
  },
  {
    id: "vitalya",
    title: "Vitalya Africa",
    category: "Édition Numérique",
    categoryColor: "#7B3415",
    client: "Flaugust Business (produit propre)",
    country: "Afrique francophone",
    flag: "🌍",
    year: "2025–2026",
    services: ["Magazine numérique", "E-commerce", "Plateforme d'abonnement"],
    stack: ["React", "Substack", "Shopify", "Stripe", "PawaPay"],
    challenge:
      "Créer un magazine numérique de santé, beauté et bien-être ciblant l'Afrique francophone, avec un modèle économique double : abonnements et boutique e-commerce.",
    solution:
      "Développement d'un écosystème complet : magazine publié sur Substack (vitalya.africa), boutique dropshipping sur Shopify intégrant Stripe pour l'Europe et PawaPay pour le paiement mobile money africain.",
    results: [
      "Première édition publiée : Avril 2026",
      "8 articles sur 5 sections éditoriales",
      "4 niveaux d'abonnement : 0€ / 5€ / 10€ / 20€",
      "Livraison en France, Belgique, Suisse, Canada",
    ],
    color: "#7B3415",
    imageUrl: null,
  },
  {
    id: "flaugust-intel",
    title: "FLAUGUST INTEL",
    category: "Agent IA",
    categoryColor: "#B83080",
    client: "Flaugust Business (agent interne)",
    country: "International",
    flag: "🤖",
    year: "2024",
    services: ["Agent IA autonome", "Veille multi-plateformes", "Génération de leads"],
    stack: ["Twin.so", "LinkedIn Jobs", "Upwork", "Indeed", "Reddit"],
    challenge:
      "Automatiser la prospection commerciale sur LinkedIn, Upwork, Indeed, Reddit et Google en scannant en continu les opportunités de missions et les appels à projets.",
    solution:
      "Déploiement de FLAUGUST INTEL, un agent IA autonome qui scanne 10+ plateformes selon une rotation de villes, rédige des emails de candidature adaptés par région et tarif, et rapporte deux fois par semaine.",
    results: [
      "Scanning automatisé de 10+ plateformes",
      "Emails de candidature générés automatiquement",
      "Tarification par région : à partir de 500€ (Europe), 150 000 FCFA (Afrique)",
      "Rapports bihebdomadaires par email",
    ],
    color: "#B83080",
    imageUrl: null,
  },
  {
    id: "magazia",
    title: "MagazIA — Plateforme SaaS",
    category: "SaaS",
    categoryColor: "#E88930",
    client: "Flaugust Business (produit SaaS)",
    country: "Afrique francophone",
    flag: "🌍",
    year: "2025",
    services: ["Plateforme SaaS", "Éditeur de magazine IA", "Gestion abonnements"],
    stack: ["React", "TypeScript", "Supabase", "Lovable.dev", "CinetPay", "Stripe"],
    challenge:
      "Les institutions africaines (diocèses, ONG, collectivités) publient encore leurs bulletins en papier ou en PDF statiques. Créer une plateforme qui leur permette de produire des magazines numériques interactifs sans compétence technique.",
    solution:
      "MagazIA est une plateforme SaaS où l'utilisateur décrit son magazine, et l'IA génère automatiquement le contenu éditorial structuré. Publication en format flip book interactif, gestion des abonnés, paiement CinetPay + Stripe.",
    results: [
      "Plateforme 100% no-code pour l'utilisateur final",
      "Génération IA du contenu éditorial",
      "Format flip book interactif via Calaméo",
      "Paiement mobile money intégré (CinetPay)",
    ],
    color: "#E88930",
    imageUrl: null,
  },
  {
    id: "certipro",
    title: "CertiPro — Certificats en ligne",
    category: "Application Web",
    categoryColor: "#1A6B35",
    client: "Flaugust Business (produit propre)",
    country: "Afrique francophone",
    flag: "📄",
    year: "2025",
    services: [
      "Application web",
      "Génération de certificats PDF",
      "Interface admin",
    ],
    stack: ["React", "TypeScript", "Supabase", "Lovable.dev"],
    challenge:
      "Les institutions — écoles, associations, entreprises, organisateurs d'événements — passent un temps considérable à créer et envoyer manuellement des certificats de participation, de formation ou de reconnaissance. Aucun outil abordable n'existait en français pour ce besoin.",
    solution:
      "CertiPro est une application web opérationnelle qui permet à toute institution de créer, personnaliser et générer des certificats professionnels en quelques minutes. Modèles prédéfinis, logo de l'organisation intégré, signature numérique et export PDF haute qualité immédiat — sans aucune compétence technique requise.",
    results: [
      "Application web opérationnelle et fonctionnelle",
      "Génération de certificats en moins de 2 minutes",
      "Export PDF haute qualité, prêt à imprimer ou partager",
      "Interface admin intuitive, zéro formation nécessaire",
      "Accessible depuis n'importe quel navigateur",
    ],
    color: "#1A6B35",
    imageUrl: null,
  },
];

export const portfolioCategories = [
  "Tous",
  "ONG",
  "Agent IA",
  "SaaS",
  "Édition Numérique",
  "Application Web",
] as const;
