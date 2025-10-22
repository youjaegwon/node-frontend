#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/apps/frontend"
BUILD_DIR="$APP_DIR/dist"
WEB_ROOT="/var/www/myapp"

echo "==> Frontend deploy start"
cd "$APP_DIR"

# 0️⃣ git 최신 반영
if [ -d .git ]; then
  echo "==> git pull"
  git fetch --all
  git reset --hard origin/main || git pull
else
  echo "[WARN] .git 디렉토리 없음 — 수동 수정 버전으로 인식"
fi

# 1️⃣ npm deps 설치 (vite는 devDeps이므로 제외 X)
if [ -f package-lock.json ]; then
  echo "==> npm ci"
  npm ci || { echo "[warn] npm ci 실패, npm install로 대체"; npm install; }
else
  echo "==> npm install"
  npm install
fi

# 2️⃣ 빌드
echo "==> npm run build"
npm run build

[ -d "$BUILD_DIR" ] || { echo "ERROR: $BUILD_DIR 없음"; exit 1; }
[ -f "$BUILD_DIR/index.html" ] || { echo "ERROR: dist/index.html 없음"; exit 1; }

# 3️⃣ 배포
echo "==> sync to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$BUILD_DIR"/ "$WEB_ROOT"/
sudo chown -R www-data:www-data "$WEB_ROOT"

# 4️⃣ 배포 정보
COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
DATE_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
sudo tee "$WEB_ROOT/.deploy-info" >/dev/null <<INFO
frontend_commit=$COMMIT
deployed_at=$DATE_UTC
INFO
sudo chown www-data:www-data "$WEB_ROOT/.deploy-info"

# 5️⃣ Nginx reload
if command -v nginx >/dev/null; then
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "[OK] Frontend deployed ✓"
