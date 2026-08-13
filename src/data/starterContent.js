export const STARTER_TOOLS = [
  {
    id: 'tool-01',
    title: 'Can I Use',
    description: 'Up-to-date browser support tables for modern frontend web technologies, HTML5, CSS3, and JavaScript APIs.',
    category: 'Compatibility',
    url: 'https://caniuse.com',
    tags: ['Browser Support', 'CSS', 'HTML5', 'Web APIs'],
    status: 'published'
  },
  {
    id: 'tool-02',
    title: 'SVGOMG',
    description: 'Clean, optimize and strip redundant metadata from SVG graphics without losing visual clarity.',
    category: 'Optimization',
    url: 'https://jakearchibald.github.io/svgomg/',
    tags: ['SVG', 'Optimization', 'Performance', 'Design'],
    status: 'published'
  },
  {
    id: 'tool-03',
    title: 'Squoosh',
    description: 'Google’s image compression web app supporting modern formats like WebP, AVIF, MozJPEG and PNG.',
    category: 'Optimization',
    url: 'https://squoosh.app',
    tags: ['Images', 'WebP', 'AVIF', 'Compression'],
    status: 'published'
  },
  {
    id: 'tool-04',
    title: 'Bundlephobia',
    description: 'Find the cost and bundle weight of adding any npm package to your frontend application.',
    category: 'Package Discovery',
    url: 'https://bundlephobia.com',
    tags: ['npm', 'Bundle Size', 'Performance', 'Dependencies'],
    status: 'published'
  },
  {
    id: 'tool-05',
    title: 'Realtime Colors',
    description: 'Visualize color palettes, contrasts, and typography directly on real UI layouts in real-time.',
    category: 'Design & Colors',
    url: 'https://realtimecolors.com',
    tags: ['Colors', 'Palette', 'UI Design', 'Contrast'],
    status: 'published'
  },
  {
    id: 'tool-06',
    title: 'Hoppscotch',
    description: 'Lightweight, privacy-first open-source API development ecosystem and REST/GraphQL testing client.',
    category: 'API Testing',
    url: 'https://hoppscotch.io',
    tags: ['API', 'HTTP', 'REST', 'GraphQL'],
    status: 'published'
  },
  {
    id: 'tool-07',
    title: 'Ray.so',
    description: 'Generate beautiful, customizable code snippets with syntax highlighting and gradients for sharing.',
    category: 'Developer Media',
    url: 'https://ray.so',
    tags: ['Code Snippets', 'Images', 'Sharing', 'Design'],
    status: 'published'
  },
  {
    id: 'tool-08',
    title: 'CSS Grid Generator',
    description: 'Interactive visual tool by Sarah Drasner to generate CSS Grid templates and responsive areas.',
    category: 'CSS & Layout',
    url: 'https://cssgrid-generator.netlify.app',
    tags: ['CSS Grid', 'Layout', 'Code Generator'],
    status: 'published'
  },
  {
    id: 'tool-09',
    title: 'Lucide Icons',
    description: 'Beautiful, customizable & consistent open-source icon set designed for modern web interfaces.',
    category: 'Design & Icons',
    url: 'https://lucide.dev/icons',
    tags: ['Icons', 'SVG', 'React', 'Design'],
    status: 'published'
  },
  {
    id: 'tool-10',
    title: 'RegExr',
    description: 'Online tool to learn, build, and test Regular Expressions with visual syntax highlighting and explanations.',
    category: 'Utilities',
    url: 'https://regexr.com',
    tags: ['Regex', 'JavaScript', 'Testing', 'Strings'],
    status: 'published'
  },
  {
    id: 'tool-11',
    title: 'WebPageTest',
    description: 'Deep performance diagnostic analysis, Core Web Vitals, waterfall charts, and visual comparisons.',
    category: 'Performance',
    url: 'https://www.webpagetest.org',
    tags: ['Core Web Vitals', 'Performance', 'Lighthouse', 'CWV'],
    status: 'published'
  },
  {
    id: 'tool-12',
    title: 'Tailwind CSS Palette Generator',
    description: 'Generate complete 50-950 color scale shades with precise contrast ratios for Tailwind projects.',
    category: 'Design & Colors',
    url: 'https://uicolors.app',
    tags: ['Tailwind', 'Palette', 'Colors', 'CSS'],
    status: 'published'
  }
];

export const STARTER_COMMANDS = [
  {
    id: 'cmd-01',
    title: 'Create Vite React Project',
    command: 'npm create vite@latest my-app -- --template react',
    description: 'Scaffolds a lightning-fast React application using modern Vite tooling.',
    category: 'Vite',
    tags: ['Vite', 'React', 'Scaffolding']
  },
  {
    id: 'cmd-02',
    title: 'Initialize Git Repository & Main Branch',
    command: 'git init -b main && git add . && git commit -m "Initial commit"',
    description: 'Initializes a new Git repo with standard main branch and commits all current files.',
    category: 'Git',
    tags: ['Git', 'VCS', 'Init']
  },
  {
    id: 'cmd-03',
    title: 'Undo Last Commit (Keep Staged Changes)',
    command: 'git reset --soft HEAD~1',
    description: 'Rewinds the last commit without losing any modified code or file changes.',
    category: 'Git',
    tags: ['Git', 'Undo', 'History']
  },
  {
    id: 'cmd-04',
    title: 'Install Tailwind CSS + PostCSS + Autoprefixer',
    command: 'npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p',
    description: 'Installs Tailwind CSS tooling and generates both tailwind.config.js and postcss.config.js.',
    category: 'Tailwind',
    tags: ['Tailwind', 'PostCSS', 'CSS']
  },
  {
    id: 'cmd-05',
    title: 'Check Installed Package Updates',
    command: 'npm outdated',
    description: 'Lists all outdated npm dependencies with current, wanted, and latest available versions.',
    category: 'npm',
    tags: ['npm', 'Dependencies', 'Audit']
  },
  {
    id: 'cmd-06',
    title: 'Clean npm Cache & Reinstall',
    command: 'rm -rf node_modules package-lock.json && npm cache clean --force && npm install',
    description: 'Completely purges node modules and cache to resolve tricky dependency locks.',
    category: 'npm',
    tags: ['npm', 'Clean', 'Troubleshoot']
  },
  {
    id: 'cmd-07',
    title: 'Run Production Build Preview',
    command: 'npm run build && npm run preview',
    description: 'Builds production bundle and hosts a local HTTP server simulating real deployment.',
    category: 'Vite',
    tags: ['Vite', 'Build', 'Production']
  },
  {
    id: 'cmd-08',
    title: 'Create and Switch to New Git Branch',
    command: 'git checkout -b feature/new-feature',
    description: 'Creates a new branch and immediately switches the workspace context to it.',
    category: 'Git',
    tags: ['Git', 'Branching', 'Workflow']
  },
  {
    id: 'cmd-09',
    title: 'Stash Local Changes with Descriptive Message',
    command: 'git stash save "Work in progress on navbar"',
    description: 'Saves your uncommitted changes into a named stash for quick context switching.',
    category: 'Git',
    tags: ['Git', 'Stash', 'Productivity']
  },
  {
    id: 'cmd-10',
    title: 'Deploy to Netlify via CLI',
    command: 'npx netlify deploy --prod --dir=dist',
    description: 'Deploys the built dist/ directory directly to your live production Netlify site.',
    category: 'Deployment',
    tags: ['Netlify', 'Deploy', 'Production']
  }
];

export const STARTER_SHORTCUTS = [
  {
    id: 'sc-01',
    title: 'Command Palette',
    keys: ['Ctrl', 'Shift', 'P'],
    description: 'Open the global command palette to run any editor action or setting command.',
    category: 'General'
  },
  {
    id: 'sc-02',
    title: 'Quick File Open',
    keys: ['Ctrl', 'P'],
    description: 'Quickly search and jump to any file in your project workspace.',
    category: 'Navigation'
  },
  {
    id: 'sc-03',
    title: 'Multi-Cursor Select Next Occurrence',
    keys: ['Ctrl', 'D'],
    description: 'Add a new cursor at the next matching instance of the currently selected word.',
    category: 'Multi-Cursor'
  },
  {
    id: 'sc-04',
    title: 'Toggle Integrated Terminal',
    keys: ['Ctrl', '`'],
    description: 'Show or hide the built-in terminal without losing terminal process state.',
    category: 'Terminal'
  },
  {
    id: 'sc-05',
    title: 'Duplicate Line Up / Down',
    keys: ['Shift', 'Alt', '↓'],
    description: 'Duplicate current line or selected code block immediately downwards.',
    category: 'Editing'
  },
  {
    id: 'sc-06',
    title: 'Move Line Up / Down',
    keys: ['Alt', '↑ / ↓'],
    description: 'Shift current line or selected block up or down smoothly without cutting/pasting.',
    category: 'Editing'
  },
  {
    id: 'sc-07',
    title: 'Format Document',
    keys: ['Shift', 'Alt', 'F'],
    description: 'Auto-format the current file using configured Prettier or default language formatter.',
    category: 'Formatting'
  },
  {
    id: 'sc-08',
    title: 'Rename Symbol Across Project',
    keys: ['F2'],
    description: 'Intelligently refactor and rename a variable, function, or component in all references.',
    category: 'Refactoring'
  },
  {
    id: 'sc-09',
    title: 'Toggle Line Comment',
    keys: ['Ctrl', '/'],
    description: 'Comment out or uncomment the active line or selected code block.',
    category: 'Editing'
  },
  {
    id: 'sc-10',
    title: 'Split Editor Window',
    keys: ['Ctrl', '\\'],
    description: 'Splits the active editor pane horizontally or vertically for side-by-side editing.',
    category: 'Navigation'
  },
  {
    id: 'sc-11',
    title: 'Jump to Matching Bracket',
    keys: ['Ctrl', 'Shift', '\\'],
    description: 'Jumps directly to the opening or closing bracket of the enclosing code block.',
    category: 'Navigation'
  },
  {
    id: 'sc-12',
    title: 'Select All Occurrences',
    keys: ['Ctrl', 'Shift', 'L'],
    description: 'Inserts cursors at all matching occurrences of the current selection at once.',
    category: 'Multi-Cursor'
  }
];

export const STARTER_ROADMAP_FRONTEND = [
  {
    id: 'fe-01',
    title: '1. Web Foundations & Internet Architecture',
    description: 'Understand how DNS, HTTP/HTTPS, TCP/IP, client-server models, and browsers render HTML/CSS/JS.',
    topics: ['How browsers work (DOM, CSSOM, Render Tree)', 'DNS, IP & Hosting', 'HTTP methods & status codes (200, 301, 400, 404, 500)', 'SSL/TLS certificates & HTTPS']
  },
  {
    id: 'fe-02',
    title: '2. Semantic HTML5 & Modern Document Structure',
    description: 'Write meaningful, accessible markup using native semantic tags and standard meta tags.',
    topics: ['Semantic landmarks (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>)', 'Forms & Native Form Validation (input types, required, pattern)', 'SEO Meta Tags & Open Graph cards', 'Media elements (<picture>, <video>, responsive srcset)']
  },
  {
    id: 'fe-03',
    title: '3. Modern CSS Architecture & Layout Engines',
    description: 'Master CSS Box Model, Flexbox, CSS Grid, custom properties, and fluid typography.',
    topics: ['Flexbox mastery (flex-direction, justify, align, flex-grow/shrink)', 'CSS Grid layouts (grid-template-areas, repeat, minmax, auto-fit)', 'CSS Custom Properties (Variables) & Theming', 'clamp(), min(), max() fluid calculations']
  },
  {
    id: 'fe-04',
    title: '4. Responsive Design & Mobile-First Development',
    description: 'Build layouts that fluidly adapt across mobile phones, tablets, laptops, and ultra-wide screens.',
    topics: ['Mobile-first media queries', 'Container Queries (@container)', 'Viewport units (dvh, lvh, svh)', 'Touch interactions and accessible tap targets']
  },
  {
    id: 'fe-05',
    title: '5. Version Control with Git & GitHub',
    description: 'Collaborate effectively with professional Git workflows, branching strategies, and pull requests.',
    topics: ['Git staging, commits, and log inspection', 'Branching & merge conflicts resolution', 'GitHub PR review workflows', '.gitignore and safe secrets management']
  },
  {
    id: 'fe-06',
    title: '6. JavaScript Core & ES6+ Fundamentals',
    description: 'Deep dive into language syntax, types, scopes, closures, and ES6+ modern features.',
    topics: ['let, const, variable scoping & hoisting', 'Data types, type coercion, and equality (=== vs ==)', 'Arrow functions, default parameters, rest & spread operators', 'Object & Array destructuring']
  },
  {
    id: 'fe-07',
    title: '7. DOM Manipulation & Event Handling',
    description: 'Interact directly with the browser DOM, listen to user input, and handle event bubbling.',
    topics: ['querySelector, createElement, classList', 'Event listeners, event delegation & event bubbling', 'Form submission & FormData API', 'IntersectionObserver & ResizeObserver']
  },
  {
    id: 'fe-08',
    title: '8. Asynchronous JavaScript & RESTful APIs',
    description: 'Handle network requests, async operations, and error handling effectively.',
    topics: ['Promises & chaining (.then, .catch, .finally)', 'async/await syntax & try/catch patterns', 'Fetch API (headers, request body, JSON serialization)', 'AbortController for cancelling inflight requests']
  },
  {
    id: 'fe-09',
    title: '9. Modern Package Ecosystem & Vite',
    description: 'Manage project dependencies with npm/pnpm and build fast bundles using Vite.',
    topics: ['package.json, dependencies vs devDependencies', 'npm scripts & semantic versioning (^ vs ~)', 'Vite build tool & Fast Refresh (HMR)', 'Environment variables (import.meta.env)']
  },
  {
    id: 'fe-10',
    title: '10. React Fundamentals & Declarative UI',
    description: 'Build modular, maintainable user interfaces using React component architecture and JSX.',
    topics: ['JSX rules and component composition', 'Props passing and children pattern', 'Conditional rendering techniques', 'List rendering with stable unique keys']
  },
  {
    id: 'fe-11',
    title: '11. React State Management & Core Hooks',
    description: 'Master useState, useEffect, useRef, and custom hooks for component lifecycle management.',
    topics: ['useState: immutable updates & functional setters', 'useEffect: dependencies, synchronization & cleanup functions', 'useRef: DOM references and persistent mutable values', 'Writing reusable Custom Hooks']
  },
  {
    id: 'fe-12',
    title: '12. Client-Side Routing with React Router',
    description: 'Implement multi-page navigation, nested route layouts, URL parameters, and auth guards.',
    topics: ['BrowserRouter, Routes, and Route elements', 'Outlet & nested layout hierarchies', 'NavLink active states & useParams / useSearchParams', 'Protected Route wrappers & programmatic navigation (useNavigate)']
  },
  {
    id: 'fe-13',
    title: '13. Global State & React Context API',
    description: 'Share theme, authentication, and application settings across component trees without prop drilling.',
    topics: ['createContext & useContext hook', 'Context Providers & custom provider hooks', 'Memoizing context values (useMemo) to prevent unnecessary re-renders', 'When to use Context vs component state']
  },
  {
    id: 'fe-14',
    title: '14. Modern Utility-First CSS with Tailwind CSS',
    description: 'Accelerate UI development with responsive utility classes, custom themes, and design tokens.',
    topics: ['Tailwind core philosophy & configuration', 'Dark mode strategies (selector/class based)', 'Responsive prefixes (sm:, md:, lg:, xl:)', 'Extracting reusable component patterns']
  },
  {
    id: 'fe-15',
    title: '15. Web Accessibility (a11y) & WCAG Guidelines',
    description: 'Ensure websites are usable by all people, including screen readers and keyboard navigation.',
    topics: ['WCAG 2.1 AA compliance & color contrast ratios', 'Keyboard focus management & :focus-visible', 'ARIA attributes (aria-label, aria-expanded, aria-live)', 'Accessible modals and form error handling']
  },
  {
    id: 'fe-16',
    title: '16. Core Web Vitals & Web Performance',
    description: 'Optimize page load speeds, Core Web Vitals (LCP, INP, CLS), and bundle sizes.',
    topics: ['Code splitting with React.lazy and Suspense', 'Image optimization (WebP/AVIF, lazy loading, responsive sizes)', 'Font loading strategies & font-display: swap', 'Minimizing layout shifts and main-thread blocking']
  },
  {
    id: 'fe-17',
    title: '17. Testing Frontend Applications',
    description: 'Validate code correctness with unit tests, component tests, and linting rules.',
    topics: ['ESLint & Prettier automated checks', 'Unit testing fundamentals (Vitest / Jest)', 'React Testing Library component interactions', 'Cross-browser manual testing protocols']
  },
  {
    id: 'fe-18',
    title: '18. Production Deployment & CI/CD',
    description: 'Ship web applications to Netlify, Vercel, or custom domains with automated builds.',
    topics: ['Production build configurations', 'SPA redirect rules (_redirects / netlify.toml)', 'Custom domain DNS configuration (A records, CNAME)', 'Serverless Functions for secure API calls']
  },
  {
    id: 'fe-19',
    title: '19. Progressive Web Apps (PWA) & Offline Capabilities',
    description: 'Transform web apps into installable, offline-capable applications with Service Workers.',
    topics: ['Web App Manifest (icons, standalone display, theme color)', 'Service Worker lifecycle (install, activate, fetch)', 'Cache strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate)', 'Offline fallbacks and install prompts']
  },
  {
    id: 'fe-20',
    title: '20. Frontend Developer Portfolio & Personal Brand',
    description: 'Showcase real-world projects, live demos, clean code architecture, and problem solving.',
    topics: ['Crafting high-impact case studies', 'Live deployed demos & clear GitHub READMEs', 'Semantic code organization & technical writing', 'Resume & online developer presence']
  },
  {
    id: 'fe-21',
    title: '21. Frontend Interview Preparation',
    description: 'Master JavaScript coding challenges, frontend system design, and behavioral questions.',
    topics: ['JavaScript tricky questions (event loop, closures, prototypes)', 'Building common UI widgets (infinite scroll, autocomplete, modal)', 'Frontend architecture discussions', 'Explaining tradeoffs and design decisions confidently']
  }
];

export const STARTER_ROADMAP_JS = [
  {
    id: 'js-01',
    title: 'Variables, Scoping & Memory Lifecycle',
    description: 'Understand let, const, var, block scope, function scope, and JavaScript memory allocation.',
    concepts: ['Temporal Dead Zone (TDZ)', 'Hoisting behavior in declarations vs expressions', 'Garbage collection & memory leaks prevention']
  },
  {
    id: 'js-02',
    title: 'Primitive Types & Reference Objects',
    description: 'Master value vs reference semantics, type coercion, and deep vs shallow cloning.',
    concepts: ['7 Primitive types (string, number, bigint, boolean, undefined, symbol, null)', 'Objects, Arrays, Maps, Sets', 'StructuredClone() and spread operator cloning']
  },
  {
    id: 'js-03',
    title: 'Functions, Arrow Functions & "this" Keyword',
    description: 'Demystify lexical scoping, execution context, call/apply/bind, and arrow function behavior.',
    concepts: ['Lexical "this" in arrow functions', 'Function declarations vs expressions', 'Explicit binding with call(), apply(), and bind()']
  },
  {
    id: 'js-04',
    title: 'Closures & High-Order Functions',
    description: 'Learn how inner functions retain access to outer lexical scope variables.',
    concepts: ['Encapsulation & private state', 'Currying & function factories', 'Memoization implementation']
  },
  {
    id: 'js-05',
    title: 'Modern Array Methods & Immutability',
    description: 'Perform transformative data processing cleanly with functional array helpers.',
    concepts: ['map(), filter(), reduce()', 'find(), some(), every(), flatMap()', 'Immutable sorting with toSorted() and toReversed()']
  },
  {
    id: 'js-06',
    title: 'The JavaScript Event Loop & Concurrency',
    description: 'Master the Call Stack, Microtask Queue (Promises), Macrotask Queue (setTimeout), and Render pipeline.',
    concepts: ['Call stack execution', 'Microtasks vs Macrotasks priority', 'Non-blocking I/O and browser responsiveness']
  },
  {
    id: 'js-07',
    title: 'Promises, Async/Await & Error Handling',
    description: 'Handle complex asynchronous control flows and network errors cleanly.',
    concepts: ['Promise states (pending, fulfilled, rejected)', 'Promise.all(), Promise.allSettled(), Promise.race()', 'Async/await with proper try-catch-finally']
  },
  {
    id: 'js-08',
    title: 'ES Modules (ESM) & Modular Code',
    description: 'Organize code into reusable files using standard import and export syntax.',
    concepts: ['Named exports vs default exports', 'Dynamic imports (import()) for code splitting', 'Tree-shaking and bundling principles']
  }
];

export const STARTER_ROADMAP_REACT = [
  {
    id: 'react-01',
    title: 'React Mental Model & Component Lifecycle',
    description: 'Understand how React transforms state into declarative virtual UI trees and handles reconciliation.',
    concepts: ['Virtual DOM & Reconciliation (Fiber algorithm)', 'Component purity and side-effects separation', 'JSX compilation to React elements']
  },
  {
    id: 'react-02',
    title: 'State Architecture with useState & useReducer',
    description: 'Manage local and complex multi-step component state reliably.',
    concepts: ['State batching in React 18', 'Functional state updates for derived state', 'useReducer for complex state machines and validation']
  },
  {
    id: 'react-03',
    title: 'Side Effects & Data Sync with useEffect',
    description: 'Synchronize components with external systems, timers, APIs, and subscriptions.',
    concepts: ['Effect lifecycle (mount, update, unmount)', 'Dependency array best practices & lint rules', 'Cleanup functions to prevent memory leaks and race conditions']
  },
  {
    id: 'react-04',
    title: 'Custom Hooks Composition',
    description: 'Extract and share stateful business logic across components cleanly.',
    concepts: ['Rules of Hooks', 'Building useLocalStorage, useDebounce, useMediaQuery, useFetch', 'Testing custom hooks']
  },
  {
    id: 'react-05',
    title: 'React Performance Optimization',
    description: 'Prevent unnecessary re-renders and keep web applications smooth and responsive.',
    concepts: ['React.memo for pure components', 'useCallback for stable function references', 'useMemo for expensive calculations', 'Code splitting with React.lazy and Suspense']
  },
  {
    id: 'react-06',
    title: 'Advanced Component Patterns',
    description: 'Build flexible, reusable UI component libraries using modern composition patterns.',
    concepts: ['Compound Components pattern', 'Render Props & Children function patterns', 'Portals for Modals, Tooltips and Popovers']
  }
];

export const STARTER_RESOURCES = [
  {
    id: 'res-01',
    title: 'MDN Web Docs',
    description: 'The definitive documentation resource for web developers, HTML, CSS, and JavaScript standards.',
    category: 'Docs',
    url: 'https://developer.mozilla.org',
    tags: ['MDN', 'Documentation', 'JavaScript', 'HTML', 'CSS']
  },
  {
    id: 'res-02',
    title: 'React Official Documentation',
    description: 'The official interactive React documentation with hands-on sandboxes and modern best practices.',
    category: 'Docs',
    url: 'https://react.dev',
    tags: ['React', 'Official Docs', 'Hooks', 'Components']
  },
  {
    id: 'res-03',
    title: 'Tailwind CSS Documentation',
    description: 'Comprehensive utility class reference and styling guidelines for Tailwind CSS.',
    category: 'Docs',
    url: 'https://tailwindcss.com/docs',
    tags: ['Tailwind', 'CSS', 'Design System']
  },
  {
    id: 'res-04',
    title: 'JavaScript.info',
    description: 'From the basics to advanced topics with detailed, thoroughly explained JavaScript tutorials.',
    category: 'Learning',
    url: 'https://javascript.info',
    tags: ['JavaScript', 'Tutorials', 'Deep Dive']
  },
  {
    id: 'res-05',
    title: 'web.dev by Google',
    description: 'Guidance and analysis from Google Chrome team for modern web performance, PWA, and SEO.',
    category: 'Learning',
    url: 'https://web.dev',
    tags: ['Performance', 'Core Web Vitals', 'PWA', 'Google']
  },
  {
    id: 'res-06',
    title: 'Frontend Mentor',
    description: 'Improve frontend coding skills by building realistic projects from professional Figma designs.',
    category: 'Practice',
    url: 'https://www.frontendmentor.io',
    tags: ['Practice', 'Projects', 'Figma', 'UI Challenges']
  }
];
