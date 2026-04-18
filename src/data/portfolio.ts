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
    services: ["Site web institutionnel", "Agent IA de financement", "Dashboard admin"],
    stack: ["React", "TypeScript", "Supabase", "Twin.so"],
    challenge:
      "L'ONG PRODIGES avait besoin d'une présence numérique professionnelle et d'un outil automatisé pour identifier les opportunités de financement parmi plus de 60 sources internationales.",
    solution:
      "Nous avons livré un site web institutionnel complet pour présenter les programmes de l'ONG, couplé à PRODIGES INTEL : un agent IA qui scanne les bases de données de financement en 8 langues, génère des propositions prêtes à soumettre et envoie des rapports hebdomadaires.",
    results: [
      "Site web opérationnel en moins de 3 semaines",
      "Agent IA scannant 60+ sources de financement",
      "Rapports automatiques livrés par email",
      "Coût mensuel : 20 000 FCFA",
    ],
    color: "#1A6B35",
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
  },
  {
    id: "diocese-nkongsamba",
    title: "Diocèse de Nkongsamba",
    category: "Institution Religieuse",
    categoryColor: "#7B3415",
    client: "Diocèse de Nkongsamba",
    country: "Cameroun",
    flag: "🇨🇲",
    year: "2025–2026",
    services: ["Refonte site web", "Devis et négociation", "Déploiement"],
    stack: ["React", "TypeScript", "Supabase", "Lovable.dev"],
    challenge:
      "Le Diocèse de Nkongsamba avait besoin d'une refonte complète de son site institutionnel pour mieux refléter ses activités pastorales, éducatives et sociales.",
    solution:
      "Proposition d'une refonte complète avec nouvelle charte graphique, architecture de contenu repensée et tableau de bord admin pour que l'équipe diocésaine puisse gérer le contenu de façon autonome.",
    results: [
      "Devis institutionnel soumis et en cours de validation",
      "Architecture multi-sections : pastorale, éducation, social, actualités",
      "Interface admin sans compétence technique requise",
      "Livraison prévue Q2 2026",
    ],
    color: "#7B3415",
  },
  {
    id: "plagiacscan",
    title: "PlagiaScan Pro",
    category: "SaaS",
    categoryColor: "#1A6B35",
    client: "Flaugust Business (produit SaaS)",
    country: "Afrique francophone & France",
    flag: "📄",
    year: "2025",
    services: ["SaaS anti-plagiat", "API de vérification", "Tableau de bord"],
    stack: ["Next.js", "TypeScript", "Supabase", "API Stripe"],
    challenge:
      "Les institutions académiques africaines manquent d'outils anti-plagiat abordables et adaptés au contexte francophone pour garantir l'intégrité des travaux soumis.",
    solution:
      "Développement de PlagiaScan Pro, une plateforme SaaS d'anti-plagiat en français, avec architecture Next.js complète, interface de soumission de documents, score de similarité, rapport détaillé et paiement intégré.",
    results: [
      "Architecture Next.js + Supabase complète",
      "Score de similarité et rapport détaillé",
      "API disponible pour intégration institutionnelle",
      "Déploiement en cours — UI finale en finalisation",
    ],
    color: "#1A6B35",
  },
];

export const portfolioCategories = [
  "Tous",
  "ONG",
  "Agent IA",
  "SaaS",
  "Édition Numérique",
  "Institution Religieuse",
] as const;
