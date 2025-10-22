#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/apps/frontend"
BUILD_DIR="$APP_DIR/dist"
WEB_ROOT="/var/www/myapp"

echo "==> Frontend deploy start"
cd "$APP_DIR"

# devDependencies 포함 (vite 필요)
if [ -f package-lock.json ]; then
  echo "==> npm ci"
  npm ci || { echo "[warn] npm ci 실패, npm install로 대체"; npm install; }
else
  echo "==> npm install"
  npm install
fi

echo "==> npm run build"
npm run build

[ -d "$BUILD_DIR" ] || { echo "ERROR: $BUILD_DIR 없음"; exit 1; }
[ -f "$BUILD_DIR/index.html" ] || { echo "ERROR: dist/index.html 없음"; exit 1; }

echo "==> sync to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$BUILD_DIR"/ "$WEB_ROOT"/
sudo chown -R www-data:www-data "$WEB_ROOT"

COMMIT="$(git -C "$APP_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
DATE_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
sudo tee "$WEB_ROOT/.deploy-info" >/dev/null <<INFO
frontend_commit=$COMMIT
deployed_at=$DATE_UTC
INFO
sudo chown www-data:www-data "$WEB_ROOT/.deploy-info"

if command -v nginx >/dev/null; then
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "[OK] Frontend deployed ✓"
