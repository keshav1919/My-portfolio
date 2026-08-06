const art = (label, accent = '#2563EB') => `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
<rect width="800" height="480" rx="32" fill="#EFF6FF"/>
<circle cx="670" cy="70" r="130" fill="${accent}" opacity=".12"/>
<rect x="75" y="85" width="650" height="310" rx="24" fill="white" stroke="#DBEAFE" stroke-width="4"/>
<rect x="110" y="125" width="210" height="22" rx="11" fill="${accent}"/>
<rect x="110" y="172" width="420" height="15" rx="8" fill="#CBD5E1"/>
<rect x="110" y="205" width="350" height="15" rx="8" fill="#E2E8F0"/>
<rect x="110" y="260" width="180" height="90" rx="14" fill="${accent}" opacity=".18"/>
<rect x="310" y="260" width="180" height="90" rx="14" fill="${accent}" opacity=".12"/>
<rect x="510" y="260" width="180" height="90" rx="14" fill="${accent}" opacity=".08"/>
<text x="110" y="382" font-family="system-ui" font-size="31" font-weight="700" fill="#0F172A">${label}</text>
</svg>`)}`;

export const projects = [
  { id: 1, name: 'Plantae', description: 'A fresh, responsive plant shop experience with a bold hero, collections and service-focused sections.', category: 'E-commerce', technologies: ['UI Design', 'HTML', 'CSS'], image: `${import.meta.env.BASE_URL}images/projects/plantae.jpg`, github: '', demo: '' },
  { id: 2, name: 'Beauty Salon', description: 'An editorial beauty and wellness landing page with polished imagery and appointment-focused calls to action.', category: 'Business', technologies: ['UI Design', 'Responsive', 'JavaScript'], image: `${import.meta.env.BASE_URL}images/projects/beauty-salon.jpg`, github: '', demo: '' },
  { id: 3, name: 'Armory', description: 'A cinematic cybersecurity website concept built around strong hierarchy, motion and immersive visual storytelling.', category: 'Landing', technologies: ['UI Design', 'Animation', 'Responsive'], image: `${import.meta.env.BASE_URL}images/projects/armory.jpg`, github: '', demo: '' },
  { id: 4, name: 'FashionCart', description: 'Responsive fashion e-commerce interface with reusable product cards, search and product discovery.', category: 'E-commerce', technologies: ['React', 'CSS', 'JavaScript'], image: `${import.meta.env.BASE_URL}images/projects/fashion-cart.jpg`, github: '', demo: '' },
  { id: 5, name: 'Weather App', description: 'Simple weather interface concept with location search and forecast cards.', category: 'Web App', technologies: ['JavaScript', 'CSS', 'API Ready'], image: art('Weather App', '#0284C7'), github: '', demo: '' },
  { id: 6, name: 'Todo App', description: 'Lightweight task manager with local persistence and clear completion controls.', category: 'Web App', technologies: ['React', 'LocalStorage', 'CSS'], image: art('Todo App', '#16A34A'), github: '', demo: '' },
  { id: 7, name: 'E-commerce UI', description: 'Modern shopping layout with responsive product grids, wishlist and pricing states.', category: 'E-commerce', technologies: ['React', 'Tailwind CSS', 'JavaScript'], image: art('E-commerce UI', '#DB2777'), github: '', demo: '' },
  { id: 8, name: 'Restaurant Website', description: 'Mobile-first restaurant site with menu sections, location details and booking CTA.', category: 'Business', technologies: ['HTML', 'CSS', 'JavaScript'], image: art('Restaurant Website', '#B45309'), github: '', demo: '' }
];
