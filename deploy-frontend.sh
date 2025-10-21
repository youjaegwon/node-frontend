#!/usr/bin/env bash
set -euo pipefail

cd /opt/apps/frontend

echo "==> install deps"
# CI 환경이면 npm ci, 아니면 npm i (lock 파일 기준)
if [ -f package-lock.json ]; then
  npm ci || npm install
else
  npm install
fi

echo "==> build frontend"
# 프레임워크별 산출물 이름이 다르니 빌드 후 자동 감지
npm run build

BUILD=""
for d in dist build out; do
  if [ -d "$d" ]; then BUILD="$d"; break; fi
done
if [ -z "$BUILD" ]; then
  echo "✗ 빌드 산출물 디렉터리를 찾지 못했습니다. (dist/build/out 없음)"
  exit 1
fi
echo "   -> build dir: $BUILD"

TARGET=/var/www/myapp
echo "==> sync to $TARGET"
sudo mkdir -p "$TARGET"

# 중요: 소스 뒤에는 슬래시(/), 타겟 뒤에도 슬래시(/)를 붙여야 내용물이 제대로 동기화됨
sudo rsync -ah --delete "$BUILD"/ "$TARGET"/

echo "==> fix owner"
sudo chown -R www-data:www-data "$TARGET"

echo "==> nginx reload"
sudo nginx -t && sudo systemctl reload nginx

echo "[OK] Frontend deployed (from $BUILD -> $TARGET)"
# copy plain assets (no bundler)
if [ -f app.js ]; then
  sudo cp -f app.js /var/www/myapp/app.js
fi
if [ -f style.css ]; then
  sudo cp -f style.css /var/www/myapp/style.css
fi
