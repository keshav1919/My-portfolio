# 🚀 Future Projects Developer Guide

This website is built with a **scalable dynamic project architecture**. You can easily add new projects, full interactive web applications, or external showcases **without rewriting routing, navigation, or page templates**.

---

## 📁 1. Asset Placement

Place all project images (thumbnails, covers, screenshots) in:
```txt
public/
  images/
    projects/
      your-project-slug.jpg (or .png / .webp)
```
*(Or inside `public/projects/your-project-slug/cover.webp`)*

---

## 📝 2. Adding a Project (Single Source of Truth)

Open [`src/data/projects.js`](file:///src/data/projects.js) and add one object to the `projects` array:

### Example: Standard Showcase Project (Type A — `details`)

```javascript
{
  id: 5,
  slug: 'weather-dashboard',                         // Clean URL: keshavcoder.com/projects/weather-dashboard
  title: 'Weather Dashboard',
  shortDescription: 'Real-time weather analytics app with forecast cards and geolocation.',
  description: 'Full multi-paragraph description explaining the architecture, API integration, styling choices, and user experience.',
  category: 'Web App',                               // 'E-commerce' | 'Web App' | 'Landing' | 'Business' | 'UI/UX'
  technologies: ['React', 'Tailwind CSS', 'OpenWeather API'],
  status: 'Live',                                    // 'Live' | 'In Development' | 'Completed' | 'Coming Soon' | 'Archived'
  featured: true,                                    // true = shown on homepage featured section
  projectType: 'details',                            // 'details' | 'internal-app' | 'external'
  year: '2026',
  image: `${import.meta.env.BASE_URL}images/projects/weather-dashboard.jpg`,
  thumbnail: `${import.meta.env.BASE_URL}images/projects/weather-dashboard.jpg`,
  coverImage: `${import.meta.env.BASE_URL}images/projects/weather-dashboard.jpg`,
  githubUrl: 'https://github.com/keshav1919/weather-dashboard',
  liveUrl: 'https://weather.keshavcoder.com',
  features: [
    '5-day interactive weather forecast cards',
    'Geolocation-based weather detection',
    'Dark and light mode responsive dashboard'
  ]
}
```

That's it!
- It will **automatically appear** on `/projects`.
- If `featured: true`, it will **automatically appear** on the homepage.
- The URL `keshavcoder.com/projects/weather-dashboard` will **immediately work** with full SEO tags and details!

---

## ⚡ 3. Adding a Full Standalone Internal Web Application (Type B — `internal-app`)

If you build a complete mini-app (like an e-commerce shop, terminal, calculator, or dashboard) directly inside this codebase:

### Step 1: Create your application folder & component
Create `src/projects/my-store/MyStoreApp.jsx`:
```jsx
export default function MyStoreApp({ project }) {
  return (
    <div className="my-store-scope p-8">
      <h1>Welcome to My Store</h1>
      {/* Full custom application components, state & routing here */}
    </div>
  );
}
```

### Step 2: Register it in [`src/projects/registry.js`](file:///src/projects/registry.js)
```javascript
import { lazy } from 'react';

export const internalApps = {
  'my-store': lazy(() => import('./my-store/MyStoreApp')),
};
```

### Step 3: Add the metadata in [`src/data/projects.js`](file:///src/data/projects.js)
```javascript
{
  id: 6,
  slug: 'my-store',
  title: 'My Store',
  projectType: 'internal-app', // <-- This tells the router to mount the actual app!
  ...
}
```
Now navigating to `keshavcoder.com/projects/my-store` runs the **actual full application**!

---

## 🌐 4. Adding an Externally Hosted Project (Type C — `external`)

If your project is hosted on Vercel, Netlify, or another domain:
```javascript
{
  id: 7,
  slug: 'saas-landing',
  title: 'SaaS Landing Page',
  projectType: 'external',
  liveUrl: 'https://my-saas-demo.vercel.app',
  githubUrl: 'https://github.com/keshav1919/saas-landing',
  ...
}
```
Clicking the card or "View Live" will seamlessly open the live external application in a secure new tab.

---

## 🎯 5. Project Slugs & Guidelines

1. **Unique & Lowercase**: Always use lowercase alphanumeric words separated by hyphens (e.g. `crypto-tracker`, `portfolio-v3`).
2. **Invalid Slugs**: Navigating to an unrecognized URL like `/projects/unknown-slug` safely renders the built-in **404 Project Not Found** page with one-click return to `/projects`.
3. **Deployment / Direct Refreshes**: `public/_redirects` contains `/* /index.html 200`, ensuring direct visits and browser refreshes on any `/projects/:slug` route work seamlessly on Netlify / Cloudflare / Vercel.
