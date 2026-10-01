# Flaugust Business

═══════════════════════════════════════════════════════════════
FLAUGUST BUSINESS — COMPLETE INSTITUTIONAL WEBSITE
Lovable Build Prompt — Phase 1: Public Showcase
═══════════════════════════════════════════════════════════════

Build a complete, production-ready institutional website for
FLAUGUST BUSINESS, a Chadian digital technology company. This
site is the primary commercial asset of the company. Every
detail must be pixel-perfect, professional, and reflect the
seriousness of an enterprise serving governments, international
organizations, and institutional clients across francophone Africa.

NO placeholder content. NO lorem ipsum. NO "coming soon".
Every section must contain real, complete, final content.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- React 19 + TypeScript (strict mode, no any)
- Tailwind CSS (utility-first, no inline styles)
- Shadcn/ui for base components
- Framer Motion for all animations
- React Router v7 for multi-page navigation
- React Hook Form + Zod for form validation
- EmailJS for contact form email delivery
- Lucide React for all icons
- Google Fonts: Playfair Display + Inter
- NO Supabase in this phase — all data is hardcoded

File structure:
src/
  components/
    layout/    → Navbar, Footer, WhatsAppButton
    sections/  → all home page sections
    ui/        → base shadcn components
  pages/
    HomePage.tsx
    ServicesPage.tsx
    PortfolioPage.tsx
    AboutPage.tsx
    ContactPage.tsx
    LegalPage.tsx
  data/
    services.ts
    portfolio.ts
    testimonials.ts
    stats.ts
  hooks/
    useScrollAnimation.ts
    useCounter.ts
  lib/
    utils.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLORS (define as CSS variables in index.css AND tailwind.config):

--color-primary:    #7B3415   /* Maroon — brand primary */
--color-primary-dark: #5A2510 /* Darker maroon */
--color-primary-light: #F4E8E2 /* Light maroon background */
--color-secondary:  #1A6B35   /* Forest green */
--color-secondary-light: #E2F0E8
--color-accent:     #E88930   /* Warm orange */
--color-accent-light: #FEF0DC
--color-lime:       #6DB535   /* Lime green (WhatsApp, tech badges) */
--color-magenta:    #B83080   /* AI/innovation accent */
--color-bg:         #FDFBF8   /* Warm white background */
--color-text:       #1A1A1A
--color-muted:      #6B6B6B
--color-border:     #E2D8CF

Tailwind config extend:
colors: {
  primary: { DEFAULT: '#7B3415', dark: '#5A2510', light: '#F4E8E2' },
  secondary: { DEFAULT: '#1A6B35', light: '#E2F0E8' },
  accent: { DEFAULT: '#E88930', light: '#FEF0DC' },
  lime: '#6DB535',
  magenta: '#B83080',
  brand: '#FDFBF8',
}

TYPOGRAPHY:
- Display / H1: Playfair Display, 700, #7B3415
- H2/H3: Inter, 600-700, #1A1A1A or #5A2510
- Body: Inter, 400, #1A1A1A, line-height 1.7
- Muted: Inter, 400, #6B6B6B
- Code/Tech tags: JetBrains Mono or monospace

GLOBAL STYLES (index.css):
body {
  font-family: 'Inter', sans-serif;
  background-color: #FDFBF8;
  color: #1A1A1A;
}
h1, h2 {
  font-family: 'Playfair Display', serif;
}

SPACING SCALE: use Tailwind defaults.
BORDER RADIUS: rounded-xl (12px) for cards, rounded-full for badges.
SHADOWS: shadow-sm for cards at rest, shadow-lg on hover.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — COMPANY DATA (hardcoded in src/data/company.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const company = {
  name: "Flaugust Business",
  fullName: "Établissement Flaugust Business",
  tagline: "L'intelligence numérique au service de l'Afrique.",
  subTagline: "Développement web & mobile, plateformes SaaS, agents IA — des solutions digitales d'excellence pour toutes les institutions d'Afrique francophone et du monde.",
  founder: "LUBAMA Jean Chrysostome ZACEI",
  founderTitle: "Directeur Général & Fondateur",
  founderBio: "Développeur full-stack et entrepreneur basé au Tchad, LUBAMA Jean Chrysostome ZACEI fonde Flaugust Business avec une vision claire : mettre l'expertise numérique de pointe au service des institutions africaines. Maîtrisant React, TypeScript, Supabase et les agents d'intelligence artificielle, il intervient auprès de gouvernements, d'ONG internationales, d'institutions religieuses et d'entreprises à travers le Tchad, l'Afrique centrale et le monde.",
  rccm: "TD-SRH-2024-A-140",
  anie: "N° 0008290 — Réf. 199/ANIE/DG/CGU/2024",
  founded: "2024",
  email: "contact@flaugustbusiness.com",
  phone1: "+235 63 73 17 87",
  phone2: "+235 95 50 17 64",
  whatsapp: "+237 658 560 383",
  whatsappLink: "https://wa.me/237658560383?text=Bonjour%20Flaugust%20Business%2C%20je%20souhaite%20vous%20contacter%20pour...",
  address1: "N'Djaména, Tchad",
  address2: "Sarh, Tchad",
  linkedin: "https://www.linkedin.com/in/flaugust-luhan",
  mission: "Fournir à chaque institution, qu'elle soit publique ou privée, gouvernementale ou associative, un accès à des solutions numériques de classe mondiale, parfaitement adaptées aux réalités africaines.",
  vision: "Faire de l'Afrique francophone un territoire d'excellence numérique.",
  values: [
    { title: "Excellence technique", desc: "Chaque ligne de code est pensée pour la performance, la sécurité et la durabilité." },
    { title: "Ancrage africain", desc: "Nos solutions intègrent les contraintes réelles du terrain : mobile money, faible bande passante, multilinguisme." },
    { title: "Impact institutionnel", desc: "Nous privilégions les projets qui transforment le fonctionnement des institutions et améliorent le service aux citoyens." },
    { title: "Partenariat durable", desc: "La relation avec nos clients ne s'arrête pas à la livraison. Nous accompagnons sur le long terme." },
  ],
};

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — STATISTICS (src/data/stats.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const stats = [
  { value: 25, suffix: "+", label: "Projets réalisés" },
  { value: 18, suffix: "+", label: "Clients satisfaits" },
  { value: 6,  suffix: "",  label: "Pays couverts" },
  { value: 100, suffix: "%", label: "Livrés dans les délais" },
];

Animate these counters: when the stats section enters the viewport,
numbers increment from 0 to their final value over 2 seconds using
easeOut timing. Use Framer Motion's useInView + a custom counter hook.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — SERVICES (src/data/services.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const services = [
  {
    id: "web-mobile",
    icon: "Monitor",
    color: "#7B3415",
    badge: "Core",
    title: "Développement Web & Mobile",
    shortDesc: "Sites institutionnels, applications web et mobiles sur mesure.",
    fullDesc: "Nous concevons et développons des sites web institutionnels, des applications web progressives (PWA) et des applications mobiles Android/iOS, du prototype à la mise en production. Chaque solution est responsive, sécurisée, performante et optimisée pour les réseaux africains.",
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
    icon: "Layers",
    color: "#1A6B35",
    badge: "SaaS",
    title: "Plateformes SaaS",
    shortDesc: "Solutions logicielles en mode service pour votre secteur.",
    fullDesc: "Nous concevons des plateformes SaaS multi-tenant complètes, des outils de gestion éditoriale numérique aux plateformes e-learning, en passant par les systèmes anti-plagiat et les générateurs d'applications par IA. Hébergées, maintenues, évolutives.",
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
    icon: "Bot",
    color: "#B83080",
    badge: "IA",
    title: "Agents IA & Automatisation",
    shortDesc: "Des agents intelligents qui travaillent pour vous 24h/24.",
    fullDesc: "Nous déployons des agents d'intelligence artificielle autonomes pour la veille stratégique, la recherche d'opportunités de financement, la qualification de prospects et l'automatisation des processus métier. Résultats livrés directement dans votre boîte email.",
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
    icon: "TrendingUp",
    color: "#E88930",
    badge: "Growth",
    title: "Marketing Digital & E-Commerce",
    shortDesc: "Visibilité en ligne, ventes et croissance numérique.",
    fullDesc: "Stratégies SEO, gestion des réseaux sociaux, création de boutiques e-commerce avec paiement mobile money intégré, campagnes publicitaires digitales. Nous connectons vos produits et services à vos clients, localement et à l'international.",
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
    icon: "Building2",
    color: "#7B3415",
    badge: "Institutions",
    title: "Services Institutionnels Numériques",
    shortDesc: "La digitalisation complète de votre institution.",
    fullDesc: "De la mairie au ministère, de l'hôpital au diocèse, nous accompagnons toutes les institutions dans leur transformation numérique : portails citoyens, systèmes de gestion interne, plateformes de communication officielle et outils de pilotage.",
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
    icon: "GraduationCap",
    color: "#1A6B35",
    badge: "Formation",
    title: "Conseil & Formation",
    shortDesc: "Stratégie digitale et renforcement des capacités.",
    fullDesc: "Nous accompagnons les décideurs dans leurs choix technologiques et formons les équipes aux outils numériques. Du cahier des charges à la formation des utilisateurs finaux, nous garantissons la prise en main et l'autonomie de vos équipes.",
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
];

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — PORTFOLIO / RÉALISATIONS (src/data/portfolio.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The portfolio section is a KEY differentiator. Every card must be
visually impactful with a colored header band, clear tags, and a
detail modal with full project information.

export const portfolioItems = [
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
    challenge: "L'ONG PRODIGES avait besoin d'une présence numérique professionnelle et d'un outil automatisé pour identifier les opportunités de financement parmi plus de 60 sources internationales.",
    solution: "Nous avons livré un site web institutionnel complet pour présenter les programmes de l'ONG, couplé à PRODIGES INTEL : un agent IA qui scanne les bases de données de financement en 8 langues, génère des propositions prêtes à soumettre et envoie des rapports hebdomadaires.",
    results: [
      "Site web opérationnel en moins de 3 semaines",
      "Agent IA scannant 60+ sources de financement",
      "Rapports automatiques livrés par email",
      "Coût mensuel : 20 000 FCFA",
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
    challenge: "Créer un magazine numérique de santé, beauté et bien-être ciblant l'Afrique francophone, avec un modèle économique double : abonnements et boutique e-commerce.",
    solution: "Développement d'un écosystème complet : magazine publié sur Substack (vitalya.africa), boutique dropshipping sur Shopify intégrant Stripe pour l'Europe et PawaPay pour le paiement mobile money africain.",
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
    challenge: "Automatiser la prospection commerciale sur LinkedIn, Upwork, Indeed, Reddit et Google en scannant en continu les opportunités de missions et les appels à projets.",
    solution: "Déploiement de FLAUGUST INTEL, un agent IA autonome qui scanne 10+ plateformes selon une rotation de villes, rédige des emails de candidature adaptés par région et tarif, et rapporte deux fois par semaine.",
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
    id: "makagazine",
    title: "MagazIA — Plateforme SaaS",
    category: "SaaS",
    categoryColor: "#E88930",
    client: "Flaugust Business (produit SaaS)",
    country: "Afrique francophone",
    flag: "🌍",
    year: "2025",
    services: ["Plateforme SaaS", "Éditeur de magazine IA", "Gestion abonnements"],
    stack: ["React", "TypeScript", "Supabase", "Lovable.dev", "CinetPay", "Stripe"],
    challenge: "Les institutions africaines (diocèses, ONG, collectivités) publient encore leurs bulletins en papier ou en PDF statiques. Créer une plateforme qui leur permette de produire des magazines numériques interactifs sans compétence technique.",
    solution: "MagazIA est une plateforme SaaS où l'utilisateur décrit son magazine, et l'IA génère automatiquement le contenu éditorial structuré. Publication en format flip book interactif, gestion des abonnés, paiement CinetPay + Stripe.",
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
    challenge: "Le Diocèse de Nkongsamba avait besoin d'une refonte complète de son site institutionnel pour mieux refléter ses activités pastorales, éducatives et sociales.",
    solution: "Proposition d'une refonte complète avec nouvelle charte graphique, architecture de contenu repensée et tableau de bord admin pour que l'équipe diocésaine puisse gérer le contenu de façon autonome.",
    results: [
      "Devis institutionnel soumis et en cours de validation",
      "Architecture multi-sections : pastorale, éducation, social, actualités",
      "Interface admin sans compétence technique requise",
      "Livraison prévue Q2 2026",
    ],
    color: "#7B3415",
    imageUrl: null,
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
    challenge: "Les institutions académiques africaines manquent d'outils anti-plagiat abordables et adaptés au contexte francophone pour garantir l'intégrité des travaux soumis.",
    solution: "Développement de PlagiaScan Pro, une plateforme SaaS d'anti-plagiat en français, avec architecture Next.js complète, interface de soumission de documents, score de similarité, rapport détaillé et paiement intégré.",
    results: [
      "Architecture Next.js + Supabase complète",
      "Score de similarité et rapport détaillé",
      "API disponible pour intégration institutionnelle",
      "Déploiement en cours — UI finale en finalisation",
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
  "Institution Religieuse",
];

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — TESTIMONIALS (src/data/testimonials.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const testimonials = [
  {
    name: "Responsable Technique",
    org: "PRODIGES Bien-être et Environnement",
    country: "Bangui, RCA",
    text: "Flaugust Business a livré bien plus qu'un site web. L'agent IA qui scanne les opportunités de financement pour notre ONG nous fait gagner des dizaines d'heures chaque mois. Le résultat est professionnel et le support est réactif.",
    rating: 5,
    avatar: "P",
    color: "#1A6B35",
  },
  {
    name: "Chef de Projet Digital",
    org: "Institution partenaire",
    country: "N'Djaména, Tchad",
    text: "Nous cherchions un développeur capable de comprendre les contraintes des institutions publiques africaines. LUBAMA et son équipe ont parfaitement saisi nos besoins et livré une solution robuste, maintenant adoptée par tous nos services.",
    rating: 5,
    avatar: "C",
    color: "#7B3415",
  },
  {
    name: "Directrice",
    org: "Organisation francophone internationale",
    country: "Paris, France",
    text: "Excellent travail. La qualité technique est au niveau des meilleures agences européennes, avec une réactivité et une adaptabilité au contexte africain qu'aucun prestataire local ne pouvait offrir. Je recommande sans réserve.",
    rating: 5,
    avatar: "D",
    color: "#B83080",
  },
];

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — NAVIGATION COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed sticky navbar. Height: 72px desktop, 64px mobile.
Background: white with border-bottom: 1px solid #E2D8CF.
Add shadow on scroll (box-shadow appears after 20px scroll).

Left: Logo (image + text "Flaugust Business" in Playfair Display,
#7B3415, 18px bold). If no logo image available, use stylized text
"FB" in a rounded square with #7B3415 background + "Flaugust Business".

Center (desktop): nav links in Inter 15px:
  Accueil | Services | Réalisations | À propos | Contact
Active link: color #7B3415, font-weight 600, underline accent.
Hover: color #7B3415, transition 200ms.

Right: Button "Nous contacter" — background #7B3415, text white,
border-radius 8px, padding 10px 20px, hover background #5A2510.

Mobile: hamburger menu (Menu icon from lucide-react).
Full-screen overlay on open: white background, all links centered,
large Inter 20px, each link separated by a line. Close button top-right.
"Nous contacter" button full-width at bottom of mobile menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — HOME PAGE (src/pages/HomePage.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sections in order:

— HERO SECTION —
Full viewport height (100vh). Two-column layout desktop,
single column mobile.

Left column (60%):
  - Small badge pill: "🌍 Présent dans 6 pays — Tchad · Cameroun · RCA · Côte d'Ivoire · France · Belgique"
    Style: background #F4E8E2, color #7B3415, rounded-full, 12px, border 1px #7B3415.
  - H1 (Playfair Display, 52px desktop / 36px mobile, #7B3415, line-height 1.15):
    "L'intelligence numérique au service de l'Afrique."
  - Subtext (Inter, 18px, #6B6B6B, max-width 520px):
    "Développement web & mobile, plateformes SaaS, agents d'IA —
     des solutions digitales d'excellence pour toutes les institutions,
     en Afrique francophone et dans le monde."
  - Two CTA buttons (side by side, stacked on mobile):
    Primary: "Découvrir nos services" → /services
      bg #7B3415, text white, px-6 py-3, rounded-xl, hover bg #5A2510
    Secondary: "Voir nos réalisations" → /portfolio
      bg transparent, border-2 #7B3415, text #7B3415, px-6 py-3,
      rounded-xl, hover bg #F4E8E2
  - Trust row below buttons (flex, gap-6, mt-6):
    ✓ RCCM TD-SRH-2024-A-140
    ✓ Attestation ANIE N° 0008290
    ✓ Livraison dans les délais
    Style: Inter 13px, #6B6B6B, check icon in #1A6B35

Right column (40%):
  Create a sophisticated decorative visual using only CSS/SVG:
  - Large rounded square background in #F4E8E2 (shadow-xl, rounded-3xl)
  - Inside: abstract geometric composition suggesting digital growth:
    * Colored vertical bars (the logo histogram motif): 4 bars in
      colors #1A6B35, #B83080, #E88930, #6DB535, heights varying
    * Floating card overlays (absolute positioned):
      Top-right: white card with shadow — "25+ Projets" in bold #7B3415,
      "Réalisés avec succès" in small gray
      Bottom-left: white card with shadow — "6 Pays" in bold #1A6B35,
      "Zone d'intervention" in small gray
  - Add subtle pulsing animation on the bars (scale up/down slightly)
  On mobile: hide this column, show only a simplified colored band.

HERO animation: on load, fade-in + slide-up with staggered delay:
  badge (0s) → H1 (0.1s) → subtext (0.2s) → buttons (0.3s) → trust row (0.4s)
  Use Framer Motion initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}

— STATS SECTION —
Background: #7B3415. Full width. Padding py-16.
4 columns desktop, 2×2 grid mobile.
Each stat:
  - Large number: Playfair Display, 48px, white, bold
  - Suffix (+, %) same style
  - Label: Inter, 14px, rgba(255,255,255,0.75), uppercase, letter-spacing 1px
Counter animation on viewport enter (useInView).
Thin vertical separator lines between stats (rgba white 0.2), hidden on mobile.

— SERVICES OVERVIEW SECTION —
Background: #FDFBF8. Padding py-20.
Header:
  - Small label: "NOS SERVICES" — uppercase, #7B3415, 12px, bold, letter-spacing 2px
  - H2 Playfair Display 36px: "Des solutions numériques pour chaque besoin"
  - Subtext: "Nous intervenons sur l'ensemble de la chaîne numérique,
    de la conception à la maintenance, pour toutes les institutions."
  Link "Voir tous nos services →" in #7B3415 bold, right-aligned.

6-card grid (3×2 desktop, 2×3 tablet, 1×6 mobile). Each card:
  - White background, border 1px #E2D8CF, rounded-xl, p-6
  - hover: shadow-lg, transform translateY(-4px), border-color #7B3415
  - transition: all 300ms ease
  - Top: icon in colored rounded square (bg = service.color + "20"), icon color = service.color
  - Badge pill top-right: service.badge, bg service.color + "15", text service.color
  - Title: Inter 18px bold #1A1A1A
  - Description: Inter 14px #6B6B6B, line-height 1.6
  - Bottom: "En savoir plus →" link in service.color
  On click: navigate to /services#service.id

— WHY FLAUGUST SECTION —
Background: white. py-20.
Two-column: left text (60%), right visual/list (40%).
Left:
  - Label "POURQUOI NOUS CHOISIR"
  - H2: "L'expertise africaine au standard mondial"
  - Body text: "Nous combinons la maîtrise technique des meilleurs
    standards internationaux avec une compréhension intime des réalités
    africaines : connectivité, mobile money, institutions, langues locales."
  - 3 highlighted points with icon + text:
    🔧 "Technologies de pointe — React, TypeScript, Supabase, agents IA"
    🌍 "Ancrage africain — Solutions adaptées aux contraintes terrain"
    ⚡ "Livraison rapide — De l'idée au déploiement en quelques semaines"
Right:
  - Vertical list of 4 values from company.values
  - Each value: number (01, 02...) in large faded #7B3415 bg text behind,
    title in bold #1A1A1A, description in #6B6B6B

— PORTFOLIO PREVIEW SECTION —
Background: #FDFBF8. py-20.
Label + H2: "Réalisations — Ce que nous avons construit"
Show first 3 portfolio items as cards (large, impactful).
"Voir toutes nos réalisations →" button → /portfolio

Each preview card:
  - Border-left: 4px solid item.color
  - White bg, rounded-xl, shadow-sm, p-6, hover shadow-lg
  - Top row: category badge (bg item.color + "15", text item.color) +
    country flag + year chip
  - Title: Inter 20px bold
  - client + country: Inter 14px #6B6B6B
  - Services tags: small chips in light gray bg
  - Challenge (1 line, truncated): Inter 14px #555
  - 1 result bullet in green
  - Arrow link "Voir le détail →"

— TESTIMONIALS SECTION —
Background: #7B3415. py-20. White text.
Label "ILS NOUS FONT CONFIANCE" in rgba white 0.6.
H2 in white Playfair: "Ce que disent nos clients"

3 cards side by side (1 column mobile):
  - Background: rgba(255,255,255,0.1), rounded-xl, p-6,
    border 1px rgba(255,255,255,0.2)
  - Avatar circle: bg testimonial.color (lighter version), initial letter,
    24px bold white
  - 5 stars (⭐) in #E88930
  - Quote text: italic, Inter 15px, rgba(255,255,255,0.9)
  - Bottom: name bold white + org + country in rgba white 0.6

— CTA SECTION —
Background gradient: from #5A2510 to #7B3415. py-20.
Centered:
  H2 white Playfair 36px: "Prêt à transformer votre institution ?"
  Subtext rgba white 0.8: "Discutons de votre projet. Réponse dans les 24 heures."
  Two buttons:
    Primary: white bg, #7B3415 text — "Démarrer un projet"
    Secondary: transparent, white border, white text — "Nous appeler directement"
      onclick: window.open("tel:+23563731787")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — SERVICES PAGE (src/pages/ServicesPage.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page header (full-width, bg #7B3415, py-16):
  Breadcrumb: Accueil > Services (white, Inter 14px)
  H1 Playfair white 44px: "Nos Services"
  Subtext white 18px: "Six piliers d'expertise numérique
  au service de toutes vos institutions."

For each of the 6 services, render a full-width detailed section
with ID = service.id (for anchor navigation from homepage).
Alternate background: white / #FDFBF8.

Each service section layout (two columns, py-16, px container):
  Left column (icon + badge + short visual accent):
    - Large icon (64px) in colored rounded square
    - Badge pill
    - Decorative vertical color bar in service.color (4px wide, 120px tall)
  Right column:
    - H2 Inter 28px bold: service.title
    - Paragraph: service.fullDesc
    - Features grid (2 columns): each feature with ✓ icon in service.color
    - Sectors badges: service.sectors as small pills
    - CTA button: "Nous contacter pour ce service →"
      bg service.color, white text, rounded-xl

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11 — PORTFOLIO PAGE (src/pages/PortfolioPage.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the most important page for conversion. Design it for
MAXIMUM clarity and impact. Institutional prospects must immediately
understand the breadth and quality of work delivered.

PAGE HEADER (same style as services, bg #7B3415):
  H1: "Réalisations"
  Subtext: "Des projets concrets, des clients réels, des résultats mesurables."

FILTER BAR (sticky below header on scroll):
  bg white, border-bottom, py-3.
  Category buttons: "Tous" | "ONG" | "Agent IA" | "SaaS" | "Édition Numérique" | "Institution Religieuse"
  Active: bg #7B3415, text white, rounded-full.
  Inactive: bg transparent, text #6B6B6B, border #E2D8CF, rounded-full, hover bg #F4E8E2.

PORTFOLIO GRID (single column full-width cards, better for detail):
  Each project = one large horizontal card (min-height 240px).
  Layout desktop: left colored band (8px, color = item.color) + left
  metadata block (280px) + right content block.

  LEFT METADATA BLOCK (bg item.color + "0D", padding 24px):
    - Category badge (filled, item.color)
    - Country flag + country name (large, bold)
    - Client name (italic, muted)
    - Year chip
    - Stack tags (small monospace pills, bg white, border)

  RIGHT CONTENT BLOCK (bg white, padding 24px, flex-grow):
    - Top row: H3 Inter 22px bold (item.title) + arrow icon top-right
    - "Défi :" label (bold #7B3415) + challenge text
    - "Solution :" label (bold #1A6B35) + solution text (2 lines max)
    - "Résultats :" label (bold #E88930) + results as 2-column bullet list
      Each bullet: ✓ icon in #1A6B35 + text
    - Bottom CTA: "En savoir plus →" (text link, item.color)

  Hover effect on card: box-shadow 0 8px 32px rgba(123,52,21,0.12),
  transform translateY(-2px), left band expands to 12px.

DETAIL MODAL:
  On card click (or "En savoir plus"), open a full-screen modal overlay:
  - White panel, max-width 760px, centered, rounded-2xl, shadow-2xl
  - Close button X top-right
  - Full project info: all fields including full challenge, solution, all results
  - Stack badges + services tags
  - Country + client + year prominent at top
  - Color accent matching item.color throughout
  - Footer: "Vous avez un projet similaire ? Contactez-nous →"

EMPTY STATE (if filter returns no results):
  Centered message: "Aucun projet dans cette catégorie pour le moment."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 12 — ABOUT PAGE (src/pages/AboutPage.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header: same style, H1 "À propos", subtext.

STORY SECTION (two columns):
  Left: H2 "Notre histoire", body text about founding, mission, vision.
  Right: vertical timeline with 3 milestones:
    2024 — Fondation de Flaugust Business à Sarh, Tchad
    2024 — Premier agent IA déployé (FLAUGUST INTEL)
    2025–2026 — 25+ projets livrés dans 6 pays

FOUNDER SECTION (full width, bg #FDFBF8, py-16):
  Two columns:
  Left: avatar placeholder (large circle bg #7B3415, white "LJ" initials,
  80px, or photo placeholder 200×200 rounded-2xl with bg #F4E8E2).
  Right:
    - H2: "LUBAMA Jean Chrysostome ZACEI"
    - Title chip: "Directeur Général & Fondateur"
    - company.founderBio paragraph
    - Skills tags: React · TypeScript · Supabase · Agents IA · Next.js · Python

VALUES SECTION (bg white, py-16):
  H2: "Nos valeurs fondamentales"
  4-card grid (2×2): each value card with large number (01-04)
  in faded #7B3415 bg, title bold, description.

LEGAL / CERTIFICATIONS SECTION (bg #F4E8E2, py-12):
  H2: "Reconnaissance légale"
  Two certification cards side by side:
    Card 1 — RCCM:
      Title: "Registre du Commerce et du Crédit Mobilier"
      N°: TD-SRH-2024-A-140
      Greffe de Sarh, Tchad — 09 août 2024
      Badge: "✓ Enregistrement officiel"
    Card 2 — ANIE:
      Title: "Agence Nationale des Investissements"
      Attestation N° 0008290
      Réf. 199/ANIE/DG/CGU/2024
      Valide du 08/08/2024 au 07/08/2029
      Badge: "✓ Attestation valide"
  Note: "Ces documents sont disponibles sur demande."

GEO SECTION (bg white, py-16):
  H2: "Zone d'intervention"
  Flex wrap of country chips with flags:
  🇹🇩 Tchad (Siège) · 🇨🇲 Cameroun · 🇨🇫 République Centrafricaine
  🇨🇮 Côte d'Ivoire · 🇫🇷 France · 🇧🇪 Belgique · 🇪🇸 Espagne · 🌍 International

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 13 — CONTACT PAGE (src/pages/ContactPage.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header: same style, H1 "Contact", subtext "Réponse garantie sous 24h."

Two-column layout (form left 55%, info right 45%):

LEFT — CONTACT FORM:
  Powered by EmailJS (use window.emailjs with public key from env).
  Fields:
    - Prénom et Nom* (text input)
    - Organisation / Institution (text input)
    - Objet du projet (select):
      options: "Site web", "Application mobile", "Plateforme SaaS",
      "Agent IA", "Marketing digital", "Formation",
      "Conseil stratégique", "Autre"
    - Budget estimatif (select):
      options: "Moins de 200 000 FCFA", "200 000 – 500 000 FCFA",
      "500 000 FCFA – 1 000 000 FCFA", "Plus de 1 000 000 FCFA",
      "À définir ensemble"
    - Message* (textarea, 5 rows)
  All inputs: border 1px #E2D8CF, rounded-xl, focus border #7B3415,
  focus ring rgba(123,52,21,0.15), font Inter 15px.
  Zod validation: required fields marked with *. Error messages below
  each invalid field in #E88930.
  Submit button: full width, bg #7B3415, white, rounded-xl, py-3,
  "Envoyer le message →". Loading state with spinner.
  Success toast: "Message envoyé ! Nous vous répondrons dans les 24h."
  Error toast: "Une erreur est survenue. Veuillez réessayer ou nous
  contacter directement par WhatsApp."
  EmailJS config: use import.meta.env.VITE_EMAILJS_SERVICE_ID,
  VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY.

RIGHT — CONTACT INFO:
  Direct contact cards (white, rounded-xl, shadow-sm, p-5 each, mb-4):

  Card 1 — Email:
    Icon: Mail (lucide), color #7B3415
    Label: "Email professionnel"
    Value: contact@flaugustbusiness.com
    (clickable mailto: link)

  Card 2 — Téléphone:
    Icon: Phone, color #1A6B35
    Label: "Appel direct"
    Value: +235 63 73 17 87
    Sub: +235 95 50 17 64
    (clickable tel: links)

  Card 3 — WhatsApp:
    Icon: MessageCircle, color #6DB535
    BG: #E2F0E8
    Label: "WhatsApp — Réponse rapide"
    Value: +237 658 560 383
    CTA button: "Ouvrir WhatsApp →"
    bg #6DB535, white, rounded-xl, w-full
    href: "https://wa.me/237658560383?text=Bonjour%20Flaugust%20Business%2C%20je%20souhaite%20vous%20contacter%20pour..."
    target: "_blank"

  Card 4 — Localisation:
    Icon: MapPin, color #E88930
    Label: "Bureaux"
    Value: N'Djaména, Tchad | Sarh, Tchad

  Below cards, embed Google Maps:
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
    (use N'Djaména coordinates: 12.1348°N 15.0557°E)
    width="100%" height="220" style="border:0; border-radius:12px;"
    allowfullscreen loading="lazy">
  </iframe>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 14 — LEGAL PAGE (src/pages/LegalPage.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Simple clean page with:
  1. Éditeur du site
  2. Informations légales (RCCM, ANIE, activité)
  3. Hébergement
  4. Propriété intellectuelle
  5. Données personnelles
  6. Contact DPO: contact@flaugustbusiness.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 15 — FOOTER (src/components/layout/Footer.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Background: #1A1A1A. Text: white and rgba white variants.
Four columns desktop, two columns tablet, one column mobile.

Column 1 — Brand:
  Logo/text "Flaugust Business" in Playfair Display, white.
  Tagline in rgba white 0.6, 14px.
  RCCM: "RCCM TD-SRH-2024-A-140" — small, rgba white 0.4.
  Social icons (LinkedIn only for now): circle icon button.

Column 2 — Navigation:
  Title "Navigation" in white, 13px uppercase bold.
  Links: Accueil, Services, Réalisations, À propos, Contact
  Style: rgba white 0.6, hover white, 14px.

Column 3 — Services:
  Title "Nos services"
  6 service titles as links → /services#id

Column 4 — Contact:
  "Nous contacter" title
  contact@flaugustbusiness.com (clickable)
  +235 63 73 17 87 (clickable tel)
  +235 95 50 17 64 (clickable tel)
  "WhatsApp →" button: bg #6DB535, white, rounded-lg,
  onclick: open whatsapp link.

Divider line: rgba white 0.1.
Bottom bar:
  Left: "© 2026 Établissement Flaugust Business. Tous droits réservés."
  Right: "Mentions légales" link.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 16 — WHATSAPP FLOATING BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed position: bottom-6 right-6. z-index: 9999.
Circle button: 56px × 56px, bg #25D366, shadow-xl.
Icon: MessageCircle (lucide) in white, 28px.
Hover: scale(1.1), shadow-2xl, transition 200ms.
Pulse animation: subtle ring animation on the circle every 3s
(box-shadow pulsing from #25D366).
href: "https://wa.me/237658560383?text=Bonjour%20Flaugust%20Business%2C%20je%20souhaite%20vous%20contacter%20pour..."
target: "_blank".
Tooltip on hover (desktop): "Discutez avec nous sur WhatsApp"
(small white tooltip above the button, bg #1A1A1A, rounded-lg).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 17 — ANIMATIONS (GLOBAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All Framer Motion. Use a reusable FadeInSection wrapper component:
  initial: { opacity: 0, y: 40 }
  whileInView: { opacity: 1, y: 0 }
  transition: { duration: 0.6, ease: "easeOut" }
  viewport: { once: true, margin: "-50px" }

Use staggerChildren on grids (delay: 0.1s between children).
Page transitions: fade-in on route change.
Card hover: scale(1.02), shadow-lg.
Button hover: scale(1.02) or bg darken.
Keep all transitions under 400ms. No jarring effects.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 18 — SCROLL TO TOP BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed bottom-6 left-6. Appears only after scrolling 400px.
Circle button 44px, bg #7B3415, white ChevronUp icon.
onClick: window.scrollTo({ top: 0, behavior: 'smooth' }).
Framer Motion fade-in/out when appearing/disappearing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 19 — SEO & META
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In index.html:
<title>Flaugust Business — Solutions Numériques pour l'Afrique</title>
<meta name="description" content="Flaugust Business : développement web & mobile, plateformes SaaS, agents IA et conseil en transformation digitale pour les institutions d'Afrique francophone. RCCM TD-SRH-2024-A-140.">
<meta property="og:title" content="Flaugust Business — Solutions Numériques pour l'Afrique">
<meta property="og:description" content="Développement web, SaaS, agents IA pour gouvernements, ONG, institutions et entreprises. Tchad, Afrique centrale, monde.">
<meta property="og:type" content="website">
<link rel="canonical" href="https://flaugustbusiness.com">

Use react-helmet-async for per-page meta tags.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 20 — ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create .env.example:
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 21 — CRITICAL QUALITY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ZERO placeholder content. Every text is final and real.
2. ZERO broken layout on mobile (320px to 428px).
3. ZERO TypeScript errors (strict mode enforced).
4. ALL images that cannot load must have a meaningful
   colored placeholder with initials or icon — NEVER broken img.
5. ALL external links open in _blank with rel="noopener noreferrer".
6. ALL phone numbers are clickable (tel: links).
7. ALL email addresses are clickable (mailto: links).
8. The WhatsApp number +237 658 560 383 must route correctly
   in ALL WhatsApp links throughout the site.
9. Contact form must show loading, success, and error states.
10. Scroll animations must use once:true (no re-trigger).
11. The color #7B3415 and Playfair Display must be immediately
    identifiable as the brand — consistent across all pages.
12. Every page must have a clear H1 tag for SEO.
═══════════════════════════════════════════════════════════════
END OF PROMPT — BUILD THE COMPLETE SITE
═══════════════════════════════════════════════════════════════

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://flaugust-digital-vision.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2220c019-4988-476d-9c1a-03109702bb3e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
