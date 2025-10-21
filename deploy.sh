#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/apps/frontend"
WEB_ROOT="/var/www/myapp"
HEALTH_URL="http://127.0.0.1/"

cd "$APP_DIR"

echo "==> git fetch/pull"
git fetch --all --prune || true
git pull --rebase || true

GIT_COMMIT="$(git rev-parse --short HEAD || echo unknown)"
BUILD_TIME="$(date -u +%FT%TZ)"
APP_VERSION="$(node -p "require('./package.json').version" 2>/dev/null || echo 0.0.0)"

echo "==> npm install/build"
if npm ci; then true; else npm install; fi
npm run build || echo "(⚠️ build 단계 건너뜀 — 직접 JS 수정중일 수도 있음)"

echo "==> app.js & index.html 동기화"
sudo mkdir -p "$WEB_ROOT"
sudo cp -f "$APP_DIR"/index.html "$WEB_ROOT"/index.html
sudo cp -f "$APP_DIR"/app.js "$WEB_ROOT"/app.js

# 버전 JSON (빌드 시간 표시용)
cat >"$WEB_ROOT/fe-version.json" <<META
{
  "version": "$APP_VERSION",
  "commit": "$GIT_COMMIT",
  "buildTime": "$BUILD_TIME"
}
META

echo "==> nginx reload"
sudo nginx -t
sudo systemctl reload nginx

echo "==> health check"
for i in {1..10}; do
  if curl -fsS "$HEALTH_URL" >/dev/null; then
    echo "[OK] Frontend deployed (v$APP_VERSION $GIT_COMMIT)"
    exit 0
  fi
  sleep 0.5
done

echo "[WARN] Frontend health check failed (nginx responded non-200)"
exit 1
