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
- **Admin API** (`/api/admin/*`) — login, session cookie, booking/message
  listing and status updates. No dashboard UI has been built yet; the API
  is ready for one.

## Still to do

- SMTP credentials in `server/.env` (booking/contact notifications currently
  log to console instead of sending — nothing is lost, they still save to
  Postgres, but the clinic isn't emailed until this is set).
- Admin dashboard UI (the API exists; a screen to use it does not yet).
- Real team members, testimonials, prices and street address — everything
  currently in the client is either ported from the original placeholder
  content or clearly marked as such in the source.
- Production hosting decision for both the Express API and the Postgres
  database (currently both are local-machine only).
- Prerendering / SSR pass for full SEO parity with the previous server-
  rendered build — meta tags are wired per-route via `react-helmet-async`,
  but the HTML Google's crawler sees on first paint is still delivered by a
  client-rendered SPA today.

## Design system

Every colour, spacing value, font size, radius and shadow in
`client/tailwind.config.js` and `client/src/index.css` is copied directly
from `C:\Coding\Livora\assets\css\style.css` — not approximated.
