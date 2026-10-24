#!/usr/bin/env bash
# Деплой на Nuxt-VPS без входящего SSH (вызов с GitHub Actions через POST /api/deploy).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$ROOT/.deploy.log"
LOCK="/tmp/blockclient-deploy.lock"

exec 9>"$LOCK"
if ! flock -n 9; then
  echo "$(date -Is) deploy already running" | tee -a "$LOG"
  exit 0
fi

{
  echo "======== $(date -Is) deploy start ========"
  cd "$ROOT"

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1091
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm use 22 || nvm use default || true
  node -v
  npm -v

  git fetch origin main
  git reset --hard origin/main

  npm ci
  npm run build
  test -f .output/server/index.mjs

  pm2 restart client-prod || pm2 start ecosystem.config.cjs --only client-prod
  pm2 save || true
  pm2 status

  echo "======== $(date -Is) deploy ok ========"
} >>"$LOG" 2>&1
