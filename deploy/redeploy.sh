#!/usr/bin/env bash
# Ships a code update on the VPS: pull, install, migrate, rebuild (with the
# prerender pass), restart the API. Run this from the repo root as the
# `livora` deploy user, after the initial setup in deploy/SETUP.md is done.
#
# Usage: ./deploy/redeploy.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing server dependencies"
cd "$REPO_ROOT/server"
npm ci --omit=dev

echo "==> Applying database migrations"
npx prisma migrate deploy

echo "==> Installing client dependencies"
cd "$REPO_ROOT/client"
npm ci

echo "==> Building client (includes the prerender pass — see README.md)"
npm run build:static

echo "==> Restarting API"
sudo systemctl restart livora-api

echo "==> Reloading Nginx (picks up the new dist/ files; no config changed so this is just a precaution)"
sudo systemctl reload nginx

echo "Done. Check: sudo systemctl status livora-api"
