# Keshav Portfolio PWA

A complete, lightweight and installable frontend developer portfolio built with React, Vite and JavaScript. It is fully static, responsive, accessible and designed for low bandwidth and low hosting usage.

## Features

- Exactly eight routes: Splash, Home, About, Skills, Projects, Experience & Education, Contact and Settings
- Responsive desktop navigation and mobile bottom navigation
- Light, dark and system themes with LocalStorage persistence
- Route-based lazy loading
- Searchable and filterable local project data
- Accessible progress bars animated with Intersection Observer
- Contact actions, native clipboard fallback and toast messages
- PWA install handling, service worker and offline caching
- Accessible modal dialogs for Privacy Policy and About App
- Per-route titles, descriptions and canonical URLs
- Error boundary and graceful handling for missing links
- No backend, database, authentication, analytics or paid API

## Technology

- React
- Vite
- React Router
- Lucide React
- Vite PWA Plugin
- Native CSS animations
- LocalStorage and browser APIs

## Folder Structure

```text
keshav-portfolio/
├── public/
│   ├── icons/
│   ├── images/
│   ├── resume/
│   ├── _redirects
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── portfolio/
│   ├── constants/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── netlify.toml
├── package.json
├── vercel.json
└── vite.config.js
```

## Local Installation

Use Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Commands

```bash
npm run dev      # Development server
npm run build    # Optimized production build
npm run preview  # Preview the production build
npm run lint     # Check JavaScript and JSX
```

## Production Build

```bash
npm install
npm run build
npm run preview
```

The static output is generated in `dist/`.

## PWA Installation

1. Deploy the website over HTTPS or open it through Vite locally.
2. Open Settings.
3. Choose **Install App** when the browser makes installation available.
4. On browsers without the custom prompt, use the browser menu and choose **Install app** or **Add to Home screen**.

The installed website opens in standalone mode. Static files are cached for offline use.

## Replace Personal and Contact Details

Edit only:

```text
src/data/profile.js
```

Replace the placeholder email, phone, GitHub URL, LinkedIn URL, portfolio URL and resume URL. Empty values are handled safely and unavailable actions remain disabled or show a friendly message.

## Replace Project Links

Edit:

```text
src/data/projects.js
```

Each project supports a static `github` and `demo` URL. Leave either value empty to keep the action unavailable without breaking the page.

## Add a Real Resume

Option A: place a PDF in:

```text
public/resume/keshav-resume.pdf
```

Then set this in `src/data/profile.js`:

```js
resumeUrl: '/resume/keshav-resume.pdf'
```

Option B: use a secure external resume URL.

## Replace Images and Icons

- Profile image: replace `public/images/profile.svg` and keep the same filename, or update `profileImage` in `src/data/profile.js`.
- PWA icons: replace PNG files inside `public/icons/` while keeping their sizes and filenames.
- Favicon: replace `public/favicon.svg`.
- Project graphics: update the local SVG-data generator or each `image` value in `src/data/projects.js`.

Use compressed WebP, PNG or SVG files to keep the project lightweight.

## Environment Configuration

Copy `.env.example` to `.env` and update public values:

```bash
VITE_SITE_URL=https://your-domain.com
VITE_BASE_PATH=/
VITE_APP_VERSION=1.0.0
```

Do not place secrets in Vite environment variables because they are included in the browser build.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `VITE_SITE_URL` in project environment variables.
7. Deploy.

`vercel.json` already redirects SPA routes to `index.html`.

## Deploy on Netlify

1. Push the project to GitHub or drag the built `dist` folder into Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add `VITE_SITE_URL` in environment variables.
5. Deploy.

`netlify.toml` and `public/_redirects` already support direct route navigation.

## Deploy on Cloudflare Pages

1. Connect the Git repository in Cloudflare Pages.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set `VITE_SITE_URL`.
6. Deploy.

For SPA fallback, add a Pages rule that serves `/index.html` for unknown paths if your Cloudflare project does not automatically honor `_redirects`.

## Deploy on GitHub Pages

1. Set `VITE_BASE_PATH=/repository-name/` in the GitHub Actions build environment.
2. Install and build:

```bash
npm ci
npm run build
```

3. Publish the `dist` folder with GitHub Pages Actions.
4. For direct route refreshes, GitHub Pages needs an SPA fallback. A common option is to copy `dist/index.html` to `dist/404.html` in the deployment workflow.
5. Set `VITE_SITE_URL=https://username.github.io/repository-name`.

For a custom domain deployed at the root, use `VITE_BASE_PATH=/`.

## Performance Choices

- Fully static output
- No runtime API calls
- Lazy-loaded route files
- Small local SVG and PNG assets
- System fonts only
- Native CSS transitions and Intersection Observer
- PWA caching for generated static assets
- No heavy animation or UI library
- No analytics, tracking, backend or database
- Vite production minification and CSS code splitting

## Troubleshooting

### Install button says unavailable
PWA install prompts require HTTPS, a supported browser and a valid service worker. Use the browser menu to install when the custom event is not exposed.

### Direct route returns 404 after deployment
Confirm the platform SPA rewrite is active. Vercel and Netlify configuration files are already included.

### Resume button shows a message
Set a valid `resumeUrl` in `src/data/profile.js` or add a PDF to `public/resume/`.

### Social buttons are disabled
Add real URLs in `src/data/profile.js`.

### Canonical URL or sitemap is incorrect
Update `VITE_SITE_URL`, `public/sitemap.xml` and `public/robots.txt` before production deployment.

### Theme is not saved
Private browsing or blocked storage can prevent LocalStorage access. The app falls back safely to the system theme.
