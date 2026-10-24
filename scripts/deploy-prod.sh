#!/usr/bin/env bash
# Деплой на Nuxt-VPS (вызов с GitHub Actions через POST /api/deploy).
set -eu

ROOT="${DEPLOY_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
LOG="$ROOT/.deploy.log"
STATUS="$ROOT/.deploy.status"
LOCK="/tmp/blockclient-deploy.lock"

exec 9>"$LOCK"
if ! flock -n 9; then
  echo "$(date -Is) deploy already running" | tee -a "$LOG"
  echo "busy $(date -Is)" >"$STATUS"
  exit 0
fi

echo "running $(date -Is)" >"$STATUS"

{
  echo "======== $(date -Is) deploy start ========"
  cd "$ROOT"
  echo "ROOT=$ROOT HOME=${HOME:-} PWD=$(pwd)"

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1091
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use 22 || nvm use default || true
  fi
  export PATH="$HOME/.nvm/versions/node/$(node -v 2>/dev/null | tr -d v)/bin:$PATH"
  hash -r || true
  command -v node
  node -v
  command -v npm
  npm -v

  git fetch origin main
  git reset --hard origin/main
  git rev-parse --short HEAD
  chmod +x "$ROOT/scripts/deploy-prod.sh" || true

  npm ci
  npm run build
  test -f .output/server/index.mjs

  # Перечитать ecosystem (.env) — delete+start надёжнее restart после смены env
  pm2 delete client-prod 2>/dev/null || true
  pm2 start ecosystem.config.cjs --only client-prod
  pm2 save || true
  pm2 status

  echo "======== $(date -Is) deploy ok ========"
  echo "ok $(date -Is) $(git rev-parse --short HEAD)" >"$STATUS"
} >>"$LOG" 2>&1 || {
  echo "fail $(date -Is)" >"$STATUS"
  echo "======== $(date -Is) deploy FAILED ========" >>"$LOG"
  exit 1
}
