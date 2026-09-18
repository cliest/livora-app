// Bakes real, fully-rendered HTML into the production build so that
// crawlers that don't execute JavaScript — WhatsApp, Facebook, Twitter/X,
// Telegram, Slack link-preview bots, and search engines that skip the JS
// pass — see actual page content and correct <title>/<meta og:*> tags
// instead of the near-empty SPA shell.
//
// Run *after* `vite build`. Serves the built dist/ with `vite preview`
// (same proxy as dev, see vite.config.js `preview.proxy`), visits each
// public route in a headless browser, and writes the fully-rendered HTML
// to dist/<route>/index.html. Content fetched from the API (team,
// testimonials, prices, settings) is baked in as of build time — real
// visitors always get live data once React mounts over this and re-fetches,
// this only affects the very first paint seen by non-JS crawlers.
//
// Requires a Chromium build available to Playwright: either run
// `npx playwright install chromium` once (downloads Playwright's own
// bundled browser), or point PRERENDER_CHROMIUM_PATH at an existing
// Chrome/Chromium/Edge binary on the machine to skip that download.
import { preview } from 'vite';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;

// Every public route the app serves. The admin dashboard and the 404
// catch-all are deliberately excluded — noindex where relevant, nothing
// worth a crawler-facing static snapshot.
//
// '/' is deliberately LAST: vite preview's SPA fallback serves dist/index.html
// for any path that isn't a real file, so until every other route has been
// captured, that file must stay the pristine, title-less build shell — the
// moment it's overwritten with Home's rendered content, every route visited
// afterwards would inherit Home's <title> as a stale duplicate on top of its
// own (this actually happened during development of this script).
const ROUTES = ['/about', '/services', '/emergency', '/pricing', '/book', '/contact', '/thank-you', '/privacy', '/'];

async function main() {
  console.log('Starting preview server...');
  const previewServer = await preview({ preview: { port: PORT, open: false } });

  console.log(`Launching Chromium${process.env.PRERENDER_CHROMIUM_PATH ? ` (${process.env.PRERENDER_CHROMIUM_PATH})` : ''}...`);
  const browser = await chromium.launch({
    executablePath: process.env.PRERENDER_CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    for (const route of ROUTES) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      // React Query resolves fast against a local API, but give the final
      // paint a beat to settle after the network goes idle.
      await page.waitForTimeout(200);

      const html = await page.content();
      const outDir = route === '/' ? DIST_DIR : path.join(DIST_DIR, route.slice(1));
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, 'index.html'), html);
      console.log(`Prerendered ${route} -> ${path.relative(DIST_DIR, outDir) || '.'}/index.html`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      previewServer.httpServer.close((err) => (err ? reject(err) : resolve()));
    });
  }

  console.log(`Done — prerendered ${ROUTES.length} routes.`);
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
