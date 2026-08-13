import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dev server middleware that intercepts Netlify functions (/.netlify/functions/*)
 * and executes them locally using Node.js, so `npm run dev` works without 404s.
 */
function netlifyFunctionsDevPlugin(env) {
  return {
    name: 'netlify-functions-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        const match = url.match(/^\/\.netlify\/functions\/([a-zA-Z0-9_-]+)/);
        if (!match) return next();

        const functionName = match[1];
        const functionPath = path.resolve(__dirname, `netlify/functions/${functionName}.js`);
        if (!fs.existsSync(functionPath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: false, error: `Function ${functionName} not found` }));
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            // Inject environment variables from .env into process.env
            Object.assign(process.env, env);

            // Dynamically import the handler
            const module = await import(`${pathToFileURL(functionPath).href}?t=${Date.now()}`);
            const handler = module.handler;
            if (!handler) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Handler function not exported' }));
            }

            const event = {
              httpMethod: req.method,
              path: req.url,
              headers: req.headers,
              queryStringParameters: Object.fromEntries(new URL(req.url, 'http://localhost').searchParams),
              body: body || null,
            };

            const result = await handler(event, {});
            res.statusCode = result.statusCode || 200;
            if (result.headers) {
              for (const [k, v] of Object.entries(result.headers)) {
                res.setHeader(k, v);
              }
            }
            res.end(result.body);
          } catch (err) {
            console.error(`[netlify-functions-dev] Error running ${functionName}:`, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';
  return {
    base,
    plugins: [
      react(),
      netlifyFunctionsDevPlugin(env),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'og.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'],
        manifest: {
          name: 'Keshav',
          short_name: 'Keshav',
          description: 'Frontend Web Developer portfolio of Keshav.',
          theme_color: '#090909',
          background_color: '#090909',
          display: 'standalone',
          orientation: 'any',
          start_url: base,
          scope: base,
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          navigateFallback: `${base}index.html`,
          globPatterns: ['**/*.{js,css,html,svg,png,webp,json,txt}'],
          cleanupOutdatedCaches: true,
          runtimeCaching: []
        },
        devOptions: { enabled: false }
      })
    ],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: true
    }
  };
});
