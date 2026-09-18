# Livora Dental Clinic — PERN rebuild

PostgreSQL + Express + React + Node. Built to exactly match the original
static HTML/CSS design (see `C:\Coding\Livora` for the reference build),
without fighting a page builder's abstraction layer for every pixel.

## Structure

```
livora-app/
  server/     Express API + Prisma ORM + Postgres
  client/     React 19 + Vite + Tailwind + React Router
```

## First-time setup

### 1. Database

A local Postgres 18 instance is already running (Windows service
`postgresql-x64-18`), with a `livora` database created under the `cliest`
role. Connection string lives in `server/.env` (not committed).

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Run the first migration

```bash
cd server
npx prisma migrate dev --name init
```

This creates the `booking_requests`, `contact_messages` and `admin_users`
tables from `prisma/schema.prisma`.

### 4. Create the first admin login

```bash
cd server
node prisma/seed.js
```

Default login is `admin@livoradentalclinic.com` / `ChangeMe123!` unless you
set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars first. **Change this
before going live.**

Sign in at `/admin` with that login to reach the dashboard. The same seed
run also backfills site settings, the team, testimonials and the price list
from today's real content — but only if those tables are still empty, so
re-running the seed later never overwrites edits made from the dashboard.

### 5. Run both dev servers

```bash
# Terminal 1
cd server && npm run dev      # http://localhost:4000

# Terminal 2
cd client && npm run dev      # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the Express server, so the browser
only ever talks to `localhost:5173`.

## What's wired up

- **Booking form** (`/book`) → `POST /api/bookings` → saved to Postgres,
  clinic notified by email (once SMTP is configured in `server/.env`).
- **Contact form** (`/contact`) → `POST /api/contact` → same pattern.
- **Admin dashboard** (`/admin`, behind the existing login) —
  - **Bookings** / **Messages**: filter by status, update status inline.
  - **Site settings**: phone, email, address and socials — one editable
    record the whole public site reads from (header, footer, contact page,
    every call-to-action), instead of being hardcoded per page.
  - **Team**, **Testimonials**, **Prices**, **Accreditations**: full CRUD,
    including photo/badge upload (stored under `server/uploads`, served at
    `/uploads/*`). The About page, homepage testimonials and the Pricing
    page all read live from these instead of hardcoded arrays. Price items
    carry `isPopular` / `isEmergency` flags that also drive the homepage's
    "Popular treatments" teaser and the Emergency page's price block, so
    there's one price list, not three.
- **Privacy policy** (`/privacy`) — linked from the footer and both forms'
  consent checkboxes. Accurately describes what the site actually collects
  and does today; flagged in the page itself as needing a legal review
  before publishing, since it hasn't had one.

## Deploying

`npm run build` (in `client/`) alone is not what should go to production —
use `npm run build:static` instead. It runs `vite build`, then
`scripts/prerender.mjs`, which drives a headless browser over every public
route and bakes the real rendered HTML (correct `<title>`, `og:*` tags, and
actual page content) into `dist/<route>/index.html`. Without this step, the
initial HTML any non-JS-executing client receives — WhatsApp, Facebook,
Twitter/X and Telegram link-preview bots chief among them, since WhatsApp is
this clinic's primary channel — is the near-empty SPA shell, not the page.

Real visitors are unaffected either way: React still mounts and re-fetches
live data over the prerendered HTML, so admin edits always show up
immediately for anyone actually browsing the site (see `useSiteSettings`'s
`placeholderData` — not `initialData` — for why that matters). Only the
very first paint, before JS runs, reflects whatever was true at the last
`build:static`, so **a redeploy is needed to refresh what crawlers and link
previews see**, even though the live site itself never goes stale.

One-time setup on the server: `npx playwright install chromium` (downloads
Playwright's bundled browser), or set `PRERENDER_CHROMIUM_PATH` to an
existing Chrome/Chromium binary already on the machine to skip that.

Nginx needs to serve the prerendered files, not just fall back to the root
shell for every path — the standard SPA `try_files` pattern already does
this correctly, since each route's prerendered output is a real
`<route>/index.html`, which `$uri/` resolves to automatically:

```nginx
location / {
  root /path/to/client/dist;
  try_files $uri $uri/ /index.html;
}
```

## Still to do

- SMTP credentials in `server/.env` (booking/contact notifications currently
  log to console instead of sending — nothing is lost, they still save to
  Postgres, but the clinic isn't emailed until this is set).
- Production deployment itself — domain (`livoradentalclinic.com`) and VPS
  (Hostinger) are decided, but nothing is provisioned yet: Postgres on the
  VPS or a managed service, Nginx + a process manager (systemd/PM2) for the
  Express API, `NODE_ENV=production` (flips the admin auth cookie to
  `Secure`), `CLIENT_ORIGIN` and `VITE_API_URL` set to the real domain, and
  a Postgres backup strategy.

## Design system

Every colour, spacing value, font size, radius and shadow in
`client/tailwind.config.js` and `client/src/index.css` is copied directly
from `C:\Coding\Livora\assets\css\style.css` — not approximated.
