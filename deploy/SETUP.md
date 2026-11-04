# Production deployment — Hostinger VPS + livoradentalclinic.com

One-time setup. For shipping updates afterwards, use `deploy/redeploy.sh`
instead of repeating this.

Architecture: single Nginx server on one domain, serving the built client
as static files and reverse-proxying `/api/*` + `/uploads/*` to the Express
process on `localhost:4000`. Same origin end-to-end — no CORS, no
cross-site cookie complications for the admin login. See `deploy/nginx.conf`.

## 0. Before you start

- DNS: point `livoradentalclinic.com` and `www.livoradentalclinic.com`
  A records at the VPS's IP address. Do this first — it can take a while to
  propagate, and certbot (step 8) needs it to already resolve.
- You'll need root or sudo SSH access to the VPS.

## 1. Base packages and a non-root deploy user

Run as root (or with sudo) on the VPS:

```bash
apt update && apt upgrade -y
apt install -y curl git nginx postgresql postgresql-contrib ufw

# Deploy user — the app runs as this, not root
adduser --disabled-password --gecos "" livora
usermod -aG sudo livora

# Firewall: SSH + web only
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

Switch to that user for the rest of this (`su - livora`), except where a
step is explicitly marked sudo/root.

## 2. Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # confirm 22.x or newer
```

## 3. Postgres

```bash
sudo -u postgres psql -c "CREATE USER livora WITH PASSWORD 'CHANGE_ME';"
sudo -u postgres psql -c "CREATE DATABASE livora OWNER livora;"
```

Use that same password in `server/.env`'s `DATABASE_URL` in step 6. (If
you'd rather use a managed Postgres service instead of self-hosting it on
this VPS, skip this step and use the connection string it gives you —
you also don't need `deploy/backup-db.sh` in that case, since managed
services normally back up for you.)

## 4. Get the code onto the server

```bash
sudo mkdir -p /var/www/livora-app
sudo chown livora:livora /var/www/livora-app
cd /var/www/livora-app
git clone https://github.com/cliest/livora-app.git .
```

(Or `git pull` if it's already there from a previous attempt.)

## 5. Server environment

```bash
cd /var/www/livora-app/server
cp .env.production.example .env
nano .env   # fill in DATABASE_URL password, JWT_SECRET, SEED_ADMIN_PASSWORD, etc.
```

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## 6. Install, migrate, seed

```bash
cd /var/www/livora-app/server
npm ci --omit=dev
npx prisma migrate deploy
node prisma/seed.js
```

Known gotcha (also seen in local dev): `prisma generate` — which
`migrate deploy` runs internally — sometimes fails to finish copying its
query engine binary. If `node prisma/seed.js` errors with something like
"could not locate the Query Engine", run:

```bash
cp node_modules/@prisma/engines/libquery_engine-*.so.node generated/client/ 2>/dev/null || true
```

(The exact filename differs on Linux vs. the `.dll.node` seen in local
Windows dev — `ls node_modules/@prisma/engines/` to check what's actually
there if the wildcard above doesn't match anything.)

This also creates the real admin login from `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `.env` — **not** the repo's default credentials.

## 7. Build the client

```bash
cd /var/www/livora-app/client
npm ci
npx playwright install chromium --with-deps   # one-time; needed by the prerender step
npm run build:static
```

`build:static` is the one to use, not plain `build` — see the README for
why (it's what makes WhatsApp/Facebook link previews and crawlers see real
content instead of an empty shell). This produces `client/dist/`, which is
what Nginx serves.

## 8. systemd service for the API

```bash
sudo cp /var/www/livora-app/deploy/livora-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now livora-api
sudo systemctl status livora-api   # should show "active (running)"
```

## 9. Nginx + SSL

Do "Staff dashboard: private address and password gate" (below) first: the
site config includes its snippet, so `nginx -t` fails until it exists.

```bash
sudo cp /var/www/livora-app/deploy/nginx.conf /etc/nginx/sites-available/livoradentalclinic.com
sudo ln -s /etc/nginx/sites-available/livoradentalclinic.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d livoradentalclinic.com -d www.livoradentalclinic.com
```

Certbot rewrites the Nginx config to add HTTPS and an HTTP→HTTPS redirect.
Once that's confirmed working, go back to `server/.env` and set
`NODE_ENV=production` (this makes the admin auth cookie `Secure`, i.e.
HTTPS-only — only turn it on once HTTPS is actually live, otherwise the
admin login will silently stop working), then:

```bash
sudo systemctl restart livora-api
```

### Staff dashboard: private address and password gate

The dashboard isn't at `/admin`. It only exists at a private address you
choose, behind an extra Nginx username and password, in front of the app's
own sign-in (password + authenticator code). The address must never be
committed: this repository is public.

```bash
# 1. Choose the private address (note it down somewhere safe, e.g. a
#    password manager), e.g. /staff-3f9a1c7e2b
echo "/staff-$(openssl rand -hex 5)"

# 2. Install the snippet with that address in place of /ADMIN_PATH
sudo mkdir -p /etc/nginx/snippets
sudo cp /var/www/livora-app/deploy/nginx-admin.conf /etc/nginx/snippets/livora-admin.conf
sudo sed -i 's#/ADMIN_PATH#/staff-3f9a1c7e2b#' /etc/nginx/snippets/livora-admin.conf   # your address

# 3. Create the gate's username and password (staff share this one; use a
#    long random password, e.g. from: openssl rand -base64 18)
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/livora-admin.htpasswd livora-staff
sudo chown root:www-data /etc/nginx/livora-admin.htpasswd
sudo chmod 640 /etc/nginx/livora-admin.htpasswd
```

**If the site is already live** (certbot has already rewritten the config):
also add this line inside the `server { … }` block that has `listen 443 ssl`
in `/etc/nginx/sites-available/livoradentalclinic.com`, next to the other
`location` blocks:

```nginx
    include snippets/livora-admin.conf;
```

Then `sudo nginx -t && sudo systemctl reload nginx`.

- To add or change a gate login later:
  `sudo htpasswd /etc/nginx/livora-admin.htpasswd <username>` (no `-c`, which
  would wipe the file).
- To move the dashboard to a new address, edit
  `/etc/nginx/snippets/livora-admin.conf` and reload Nginx. Nothing in the
  code needs to change.
- Browsers remember the gate login until they're closed. If a browser asks
  for it a second time on the same visit, enter the same details.

## 10. Daily database backups (only if Postgres is self-hosted here — skip for a managed DB)

```bash
crontab -e
# add:
0 3 * * * /var/www/livora-app/deploy/backup-db.sh >> /var/log/livora-backup.log 2>&1
```

## 11. Smoke test

- Visit `https://livoradentalclinic.com` — confirm padlock/HTTPS and the
  homepage loads.
- Open the private dashboard address: the browser should ask for the gate
  login, then show the staff sign-in. Sign in and set up the authenticator
  app when prompted.
- Submit a test booking, confirm it appears under Bookings in the dashboard.
- `curl -s -o /dev/null -w "%{http_code}\n" https://livoradentalclinic.com/api/admin/me`
  should print `401` (stopped by the gate), and `/admin` should show the
  site's normal "page not found".
- `curl -s https://livoradentalclinic.com/about | grep '<title>'` — should
  show exactly one `<title>` tag with real content (confirms the
  prerendered build is being served, not just the SPA shell).

## 12. Automated deploys via GitHub Actions (attempted, not currently working)

**Status: not in use.** This was tried on this repo — jobs got stuck
indefinitely "Queued" on GitHub-hosted runners with no obvious cause
(billing and Actions permissions both checked out fine). Not worth more
time chasing since manual `redeploy.sh` does the same job. The credentials
below were removed again after the attempt; this section is left as
reference if it's worth revisiting later, e.g. by trying self-hosted
runners instead of `ubuntu-latest`, which sidesteps GitHub's own runner
queue entirely.

The idea: `.github/workflows/deploy.yml` (currently `workflow_dispatch`-only,
no `push` trigger) SSHes into the VPS and runs `deploy/redeploy.sh`, the
same script you'd run by hand. No separate deploy logic to keep in sync.

**On the VPS**, as the `livora` user, generate a dedicated deploy keypair
(don't reuse your personal SSH key):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy   # copy this whole private key — you'll paste it into GitHub next
```

Install the scoped sudoers rule so `redeploy.sh`'s two `sudo systemctl`
calls can run non-interactively over SSH (this does **not** grant broad
sudo — only exactly those two commands, see the file's comment):

```bash
sudo cp /var/www/livora-app/deploy/livora-sudoers /etc/sudoers.d/livora-deploy
sudo chmod 440 /etc/sudoers.d/livora-deploy
sudo visudo -c   # should print "parsed OK" for every file it checks
```

**On GitHub** (repo → Settings → Secrets and variables → Actions → New
repository secret), add:

- `VPS_HOST` — the VPS's IP address or hostname
- `VPS_SSH_KEY` — the entire private key you just printed, including the
  `-----BEGIN OPENSSH PRIVATE KEY-----` / `-----END...-----` lines

That's it — the next push to `master` triggers a deploy. Watch it under the
repo's **Actions** tab. You can also trigger one manually from there
without pushing anything (`workflow_dispatch` is enabled).

If you'd rather not automate this yet, skip this step entirely — running
`deploy/redeploy.sh` by hand over SSH works exactly the same way, on your
own schedule.

## Shipping future updates

Either push to `master` (if step 12 is set up), or run `deploy/redeploy.sh`
by hand from the repo root on the VPS. Both do the same thing: pull,
install, migrate, rebuild (with the prerender pass), and restart the API.
