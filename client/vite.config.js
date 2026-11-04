import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// The staff dashboard is its own entry (admin.html), so none of its code or
// routes are in the bundle public visitors download. In production Nginx
// serves it only at a private address (deploy/nginx-admin.conf). Locally it's
// at /admin: this rewrites /admin and /admin/* to admin.html for the dev
// server and `vite preview`.
function adminEntryLocally() {
  const rewrite = (req, _res, next) => {
    if (req.url === '/admin' || req.url.startsWith('/admin/') || req.url.startsWith('/admin?')) req.url = '/admin.html';
    next();
  };
  return {
    name: 'livora-admin-entry',
    // Block bodies on purpose: a function returned from these hooks is taken
    // as a "run after Vite's own middleware" callback.
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminEntryLocally()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 5173,
    // Proxy API calls during dev so the browser only ever talks to one
    // origin — avoids needing CORS credential quirks in local development.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Admin-uploaded team/testimonial photos are served from the API.
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    // `vite preview` serves the production build — scripts/prerender.mjs
    // drives a headless browser against this to bake real page content
    // into static HTML. Needs the same proxy as the dev server so pages
    // fetching team/testimonials/prices/settings get real data at build
    // time, not a proxy error.
    port: 4174,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
