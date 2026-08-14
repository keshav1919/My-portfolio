const defaultGithub = 'https://github.com/keshav1919';

/**
 * Scalable Centralized Project Registry
 * 
 * Project Types:
 * - 'details'      : (Type A) Rich project showcase page at /projects/:slug
 * - 'internal-app' : (Type B) Full standalone internal React application mounted at /projects/:slug
 * - 'external'     : (Type C) Project hosted externally on a separate domain/subdomain
 * 
 * Status Options:
 * - 'Live' | 'In Development' | 'Completed' | 'Coming Soon' | 'Archived'
 */
export const projects = [
  {
    id: 'devhub',
    slug: 'devhub',
    title: 'DevHub',
    name: 'DevHub',
    shortDescription: 'All-in-one developer utility workspace featuring web tools, terminal commands, shortcuts, roadmaps, and resources.',
    description: 'DevHub is a comprehensive developer productivity suite combining web utilities, CSS & code generators, CLI & Git cheat sheets, VS Code shortcuts, interactive learning roadmaps with step tracking, and curated developer documentation in one unified workspace.',
    category: 'Web App',
    technologies: ['React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
    status: 'Live',
    featured: true,
    projectType: 'internal-app',
    year: '2026',
    image: `${import.meta.env.BASE_URL}images/projects/devhub.jpg`,
    thumbnail: `${import.meta.env.BASE_URL}images/projects/devhub.jpg`,
    coverImage: `${import.meta.env.BASE_URL}images/projects/devhub.jpg`,
    githubUrl: defaultGithub,
    liveUrl: '/projects/devhub',
    github: defaultGithub,
    demo: '/projects/devhub',
    features: [
      'Interactive web developer tools and generators',
      'Instant-search CLI & Git terminal cheatsheet with 1-click copy',
      'VS Code shortcuts directory with macOS and Windows/Linux filters',
      'Step-by-step Frontend, JavaScript & React roadmaps with live progress persistence',
      'Personal bookmarks collection synchronized across devices'
    ]
  },
  {
    id: 1,
    slug: 'plantae',
    title: 'Plantae',
    name: 'Plantae',
    shortDescription: 'A fresh, responsive plant shop experience with a bold hero, collections and service-focused sections.',
    description: 'Plantae is an elegant e-commerce concept and plant discovery showcase built with clean semantic HTML, modular CSS and dynamic component interactions. It features a high-impact hero, interactive plant collections, categorized filtering, and responsive mobile-first views designed for modern retail experiences.',
    category: 'E-commerce',
    technologies: ['UI Design', 'HTML', 'CSS', 'JavaScript'],
    status: 'Live',
    featured: true,
    projectType: 'details',
    year: '2026',
    image: `${import.meta.env.BASE_URL}images/projects/plantae.jpg`,
    thumbnail: `${import.meta.env.BASE_URL}images/projects/plantae.jpg`,
    coverImage: `${import.meta.env.BASE_URL}images/projects/plantae.jpg`,
    githubUrl: defaultGithub,
    liveUrl: defaultGithub,
    github: defaultGithub,
    demo: defaultGithub,
    features: [
      'Interactive plant collection showcase with smooth hover states',
      'Fully responsive mobile, tablet and desktop layout',
      'Clean semantic typography and visual hierarchy',
      'Organized category filtering and product cards'
    ]
  },
  {
    id: 2,
    slug: 'beauty-salon',
    title: 'Beauty Salon',
    name: 'Beauty Salon',
    shortDescription: 'An editorial beauty and wellness landing page with polished imagery and appointment-focused calls to action.',
    description: 'An editorial beauty, wellness and salon landing experience crafted with meticulous attention to spacing, modern typography, and appointment-focused conversion paths. Built with responsive grid layouts, subtle motion interactions, and accessible interface elements.',
    category: 'Business',
    technologies: ['UI Design', 'Responsive', 'JavaScript', 'CSS'],
    status: 'Live',
    featured: true,
    projectType: 'details',
    year: '2026',
    image: `${import.meta.env.BASE_URL}images/projects/beauty-salon.jpg`,
    thumbnail: `${import.meta.env.BASE_URL}images/projects/beauty-salon.jpg`,
    coverImage: `${import.meta.env.BASE_URL}images/projects/beauty-salon.jpg`,
    githubUrl: defaultGithub,
    liveUrl: defaultGithub,
    github: defaultGithub,
    demo: defaultGithub,
    features: [
      'Editorial hero with appointment call-to-action flows',
      'Services & treatment catalog with pricing breakdowns',
      'Client testimonials carousel and aesthetic styling',
      'Responsive design adapting across all viewport sizes'
    ]
  },
  {
    id: 3,
    slug: 'armory',
    title: 'Armory',
    name: 'Armory',
    shortDescription: 'A cinematic cybersecurity website concept built around strong hierarchy, motion and immersive visual storytelling.',
    description: 'A cinematic cybersecurity and security intelligence landing page built around dark-mode visual hierarchy, high-tech accents, and interactive metrics displays. Designed to present enterprise-grade protection services with punchy typography and dynamic cards.',
    category: 'Landing',
    technologies: ['UI Design', 'Animation', 'Responsive', 'CSS'],
    status: 'Live',
    featured: true,
    projectType: 'details',
    year: '2026',
    image: `${import.meta.env.BASE_URL}images/projects/armory.jpg`,
    thumbnail: `${import.meta.env.BASE_URL}images/projects/armory.jpg`,
    coverImage: `${import.meta.env.BASE_URL}images/projects/armory.jpg`,
    githubUrl: defaultGithub,
    liveUrl: defaultGithub,
    github: defaultGithub,
    demo: defaultGithub,
    features: [
      'High-contrast cybersecurity aesthetic with neon accents',
      'Real-time threat monitoring dashboard concept',
      'Interactive service tiering and capability showcases',
      'Smooth CSS scroll reveal animations and particle effects'
    ]
  },
  {
    id: 4,
    slug: 'fashion-cart',
    title: 'FashionCart',
    name: 'FashionCart',
    shortDescription: 'Responsive fashion e-commerce interface with reusable product cards, search and product discovery.',
    description: 'A comprehensive modern fashion e-commerce store interface featuring reusable product showcase cards, live search filtering, responsive navigation, and intuitive shopping bag interaction states. Engineered with modular React components for optimal performance and reusability.',
    category: 'E-commerce',
    technologies: ['React', 'CSS', 'JavaScript', 'Tailwind CSS'],
    status: 'Live',
    featured: true,
    projectType: 'details',
    year: '2026',
    image: `${import.meta.env.BASE_URL}images/projects/fashion-cart-white.jpg`,
    thumbnail: `${import.meta.env.BASE_URL}images/projects/fashion-cart-white.jpg`,
    coverImage: `${import.meta.env.BASE_URL}images/projects/fashion-cart-white.jpg`,
    githubUrl: defaultGithub,
    liveUrl: defaultGithub,
    github: defaultGithub,
    demo: defaultGithub,
    features: [
      'Dynamic product catalog with instant category filtering',
      'Interactive cart drawer state and checkout flow',
      'High-resolution product zoom and detail gallery',
      'Modular React components with reusable design tokens'
    ]
  }
];

export const getProjectBySlug = (slug) => {
  if (!slug) return undefined;
  const cleanSlug = String(slug).toLowerCase().trim();
  return projects.find((p) => p.slug === cleanSlug);
};

export const getFeaturedProjects = () => {
  return projects.filter((p) => p.featured);
};
