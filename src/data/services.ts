import {
  Monitor,
  Layers,
  Bot,
  TrendingUp,
  Building2,
  GraduationCap,
  ClipboardList,
  HeartHandshake,
  Ship,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  icon: LucideIcon;
  color: string;
  badge: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  sectors: string[];
};

export const services: Service[] = [
  {
    id: "web-mobile",
    icon: Monitor,
    color: "#7B3415",
    badge: "Core",
    title: "Développement Web & Mobile",
    shortDesc: "Sites institutionnels, applications web et mobiles sur mesure.",
    fullDesc:
      "Nous concevons et développons des sites web institutionnels, des applications web progressives (PWA) et des applications mobiles Android/iOS, du prototype à la mise en production. Chaque solution est responsive, sécurisée, performante et optimisée pour les réseaux africains.",
    features: [
      "Sites web institutionnels et corporate",
      "Applications web progressives (PWA)",
      "Applications mobiles Android & iOS",
      "Portails intranet & extranet",
      "Systèmes de gestion de contenu (CMS)",
      "Interfaces d'administration",
    ],
    sectors: ["Gouvernement", "ONG", "Santé", "Éducation", "Entreprises"],
  },
  {
    id: "saas",
    icon: Layers,
    color: "#1A6B35",
    badge: "SaaS",
    title: "Plateformes SaaS",
    shortDesc: "Solutions logicielles en mode service pour votre secteur.",
    fullDesc:
      "Nous concevons des plateformes SaaS multi-tenant complètes, des outils de gestion éditoriale numérique aux plateformes e-learning, en passant par les systèmes anti-plagiat et les générateurs d'applications par IA. Hébergées, maintenues, évolutives.",
    features: [
      "Plateformes de gestion institutionnelle",
      "Magazines numériques interactifs",
      "Plateformes e-learning et formation en ligne",
      "Outils anti-plagiat académique",
      "CRM et ERP sur mesure",
      "Tableaux de bord analytiques",
    ],
    sectors: ["Institutions académiques", "Médias", "ONG", "Gouvernement"],
  },
  {
    id: "ia-automation",
    icon: Bot,
    color: "#B83080",
    badge: "IA",
    title: "Agents IA & Automatisation",
    shortDesc: "Des agents intelligents qui travaillent pour vous 24h/24.",
    fullDesc:
      "Nous déployons des agents d'intelligence artificielle autonomes pour la veille stratégique, la recherche d'opportunités de financement, la qualification de prospects et l'automatisation des processus métier. Résultats livrés directement dans votre boîte email.",
    features: [
      "Agents de veille technologique et stratégique",
      "Détection automatique d'appels d'offres",
      "Recherche d'opportunités de financement ONG",
      "Automatisation de workflows métier",
      "Chatbots institutionnels intelligents",
      "Transcription audio automatisée",
    ],
    sectors: ["ONG", "Gouvernement", "Entreprises", "Organisations internationales"],
  },
  {
    id: "marketing",
    icon: TrendingUp,
    color: "#E88930",
    badge: "Growth",
    title: "Marketing Digital & E-Commerce",
    shortDesc: "Visibilité en ligne, ventes et croissance numérique.",
    fullDesc:
      "Stratégies SEO, gestion des réseaux sociaux, création de boutiques e-commerce avec paiement mobile money intégré, campagnes publicitaires digitales. Nous connectons vos produits et services à vos clients, localement et à l'international.",
    features: [
      "Référencement naturel (SEO) multilingue",
      "Boutiques e-commerce et paiement mobile money",
      "Gestion des réseaux sociaux",
      "Campagnes publicitaires digitales (Meta, Google)",
      "Email marketing et automation",
      "Dropshipping international",
    ],
    sectors: ["Commerce", "Industrie", "Services", "Diaspora"],
  },
  {
    id: "institutional",
    icon: Building2,
    color: "#7B3415",
    badge: "Institutions",
    title: "Services Institutionnels Numériques",
    shortDesc: "La digitalisation complète de votre institution.",
    fullDesc:
      "De la mairie au ministère, de l'hôpital au diocèse, nous accompagnons toutes les institutions dans leur transformation numérique : portails citoyens, systèmes de gestion interne, plateformes de communication officielle et outils de pilotage.",
    features: [
      "Portails institutionnels et citoyens",
      "Systèmes d'information intégrés",
      "Gestion électronique de documents (GED)",
      "Plateformes de communication officielle",
      "Bulletins et rapports numériques",
      "Audit et conseil en transformation digitale",
    ],
    sectors: ["Gouvernement", "Collectivités", "Santé", "Religieux", "Associations"],
  },
  {
    id: "training",
    icon: GraduationCap,
    color: "#1A6B35",
    badge: "Formation",
    title: "Conseil & Formation",
    shortDesc: "Stratégie digitale et renforcement des capacités.",
    fullDesc:
      "Nous accompagnons les décideurs dans leurs choix technologiques et formons les équipes aux outils numériques. Du cahier des charges à la formation des utilisateurs finaux, nous garantissons la prise en main et l'autonomie de vos équipes.",
    features: [
      "Conseil en stratégie de transformation digitale",
      "Rédaction de cahiers des charges",
      "Formation aux outils numériques",
      "Renforcement des capacités institutionnelles",
      "Ateliers de sensibilisation à la cybersécurité",
      "Management et entrepreneuriat numérique",
    ],
    sectors: ["Toutes institutions", "PME", "Associations", "Universités"],
  },
  {
    id: "management-conseil",
    icon: ClipboardList,
    color: "#7B3415",
    badge: "Conseil",
    title: "Études, Conseils & Formation en Management",
    shortDesc:
      "Accompagnement stratégique et renforcement des capacités managériales.",
    fullDesc:
      "Nous réalisons des études de faisabilité, audits organisationnels et formations en management de projets pour les institutions, ONG, entreprises et administrations. De la conception du projet à son évaluation finale, nous accompagnons les décideurs dans chaque étape.",
    features: [
      "Études de faisabilité et de marché",
      "Audit organisationnel et diagnostic",
      "Formation en gestion et suivi de projets",
      "Élaboration de plans stratégiques",
      "Évaluation et rapports de performance",
      "Accompagnement à la rédaction de rapports bailleurs",
    ],
    sectors: [
      "ONG",
      "Gouvernement",
      "Entreprises",
      "Organisations internationales",
      "Associations",
    ],
  },
  {
    id: "humanitaire",
    icon: HeartHandshake,
    color: "#B83080",
    badge: "Humanitaire",
    title: "Services au Secteur Humanitaire",
    shortDesc:
      "Solutions numériques adaptées aux contextes d'urgence et d'intervention humanitaire.",
    fullDesc:
      "Nous concevons des outils numériques pour les acteurs humanitaires opérant sur le terrain : plateformes de coordination, systèmes de collecte de données terrain, outils de reporting pour les bailleurs et solutions de communication adaptées aux zones de faible connectivité.",
    features: [
      "Plateformes de coordination inter-agences",
      "Systèmes de collecte de données terrain (offline-first)",
      "Outils de reporting pour bailleurs (OCHA, UNHCR, ECHO)",
      "Tableaux de bord de suivi des interventions",
      "Solutions de communication en zone difficile",
      "Formation des équipes terrain aux outils numériques",
    ],
    sectors: [
      "ONG internationales",
      "Agences ONU",
      "Croix-Rouge",
      "MSF",
      "Gouvernements",
    ],
  },
  {
    id: "import-export",
    icon: Ship,
    color: "#E88930",
    badge: "Commerce",
    title: "Import-Export Chine–Afrique",
    shortDesc:
      "Sourcing, logistique et conseil pour le commerce entre la Chine et l'Afrique.",
    fullDesc:
      "Nous accompagnons les entreprises et entrepreneurs africains dans leurs opérations d'import depuis la Chine : identification de fournisseurs fiables, négociation, contrôle qualité, logistique et dédouanement. Nous développons également des plateformes numériques dédiées au commerce Chine-Afrique.",
    features: [
      "Sourcing et identification de fournisseurs en Chine",
      "Négociation et contrôle qualité à la source",
      "Logistique et gestion du fret international",
      "Conseil en dédouanement et réglementation",
      "Plateformes numériques de commerce Chine-Afrique",
      "Mise en relation acheteurs africains et vendeurs chinois",
    ],
    sectors: [
      "Commerçants",
      "Entreprises",
      "PME",
      "Distributeurs",
      "Entrepreneurs",
    ],
  },
];
