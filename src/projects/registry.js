import { lazy } from 'react';

/**
 * Internal Standalone Applications Registry (Type B Projects)
 * 
 * Maps project slugs to full React application root components.
 * When a user navigates to `/projects/:slug` and the project has `projectType: 'internal-app'`,
 * the ProjectDispatcher will dynamically load and render the corresponding application component.
 * 
 * How to register a full application:
 * 1. Build your app inside `src/projects/your-app-name/` (e.g. `src/projects/my-store/MyStoreApp.jsx`)
 * 2. Add an entry to `internalApps` below:
 *    'my-store': lazy(() => import('./my-store/MyStoreApp')),
 * 3. Add the project metadata in `src/data/projects.js` with `slug: 'my-store'` and `projectType: 'internal-app'`.
 */
export const internalApps = {
  devhub: lazy(() => import('./devhub/DevHubApp')),
};

export const hasInternalApp = (slug) => {
  if (!slug) return false;
  return Boolean(internalApps[String(slug).toLowerCase().trim()]);
};

export const getInternalApp = (slug) => {
  if (!slug) return null;
  return internalApps[String(slug).toLowerCase().trim()] || null;
};
