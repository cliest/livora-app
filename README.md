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

Full first-time server setup (Postgres, Nginx, systemd, SSL, cron backups)
is in **[`deploy/SETUP.md`](deploy/SETUP.md)** — written for the actual
target (Hostinger VPS, `livoradentalclinic.com`). For shipping an update
after that initial setup, either push to `master` (auto-deploys via
`.github/workflows/deploy.yml`, once the one-time SSH key setup in
`SETUP.md` step 12 is done) or run `deploy/redeploy.sh` by hand — both do
the same thing.

The one thing worth knowing even before opening that doc: always build with
`npm run build:static` (in `client/`), never plain `npm run build`. The
extra step runs a headless-browser prerender pass that bakes real rendered
HTML — correct `<title>`, `og:*` tags, actual page content — into
`dist/<route>/index.html`. Without it, WhatsApp/Facebook/Twitter link
previews and non-JS crawlers see the near-empty SPA shell instead of the
page, since they never execute the JS that would otherwise fill it in.
Real visitors are unaffected either way — React still mounts and re-fetches
live data over the prerendered HTML — but that also means **a redeploy is
needed to refresh what crawlers and link previews see** after a content
change, even though the live site itself never goes stale.

## Still to do

- SMTP credentials in `server/.env` (booking/contact notifications currently
  log to console instead of sending — nothing is lost, they still save to
  Postgres, but the clinic isn't emailed until this is set).
- Actually running the deployment in `deploy/SETUP.md` — the domain and VPS
  are decided and the configs/scripts are ready, but nothing is provisioned
  on the real server yet.
- Real content still needed before this is public: the team section, the
  testimonials, and the street address (`addressLine1` in Site Settings is
  still "Plot 00, Street Name") are all placeholder.

## Design system

Every colour, spacing value, font size, radius and shadow in
`client/tailwind.config.js` and `client/src/index.css` is copied directly
from `C:\Coding\Livora\assets\css\style.css` — not approximated.
