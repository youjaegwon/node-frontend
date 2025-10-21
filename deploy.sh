#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/apps/frontend"
DIST_DIR="$APP_DIR/dist"
WEB_ROOT="/var/www/myapp"      # Nginx root
HEALTH_URL="http://127.0.0.1/" # Nginx 통해 확인

cd "$APP_DIR"

echo "==> git fetch/pull"
git fetch --all --prune || true
git pull --rebase || true

GIT_COMMIT="$(git rev-parse --short HEAD || echo unknown)"
BUILD_TIME="$(date -u +%FT%TZ)"
APP_VERSION="$(node -p "require('./package.json').version" 2>/dev/null || echo 0.0.0)"

echo "==> install deps (try npm ci, fallback npm install)"
if npm ci; then
  true
else
  npm install
fi

echo "==> build"
npm run build

echo "==> embed FE version (fe-version.json)"
cat > "$DIST_DIR/fe-version.json" <<META
{
  "name": "frontend",
  "version": "$APP_VERSION",
  "commit": "$GIT_COMMIT",
  "buildTime": "$BUILD_TIME"
}
META

echo "==> sync to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
# dist 내용을 루트로 동기화(삭제 포함)
sudo rsync -a --delete "$DIST_DIR"/ "$WEB_ROOT"/

echo "==> permissions"
sudo chown -R www-data:www-data "$WEB_ROOT"

echo "==> nginx reload"
sudo nginx -t
sudo systemctl reload nginx

echo "==> health check (nginx)"
for i in {1..20}; do
  if curl -fsS "$HEALTH_URL" >/dev/null; then
    echo "[OK] Frontend deployed (ver=$APP_VERSION, commit=$GIT_COMMIT, time=$BUILD_TIME)"
    exit 0
  fi
  sleep 0.5
done

echo "[ERR] Frontend health check failed"
exit 1
