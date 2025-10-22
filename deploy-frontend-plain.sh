#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/apps/frontend
BUILD_DIR="$APP_DIR/dist"
WEB_ROOT=/var/www/myapp

echo "==> clean dist"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# 소스에서 필요한 정적 파일만 dist로 복사
cp -f "$APP_DIR/index.html" "$BUILD_DIR/"
[ -f "$APP_DIR/app.js" ]      && cp -f "$APP_DIR/app.js" "$BUILD_DIR/" || true
[ -f "$APP_DIR/styles.css" ]  && cp -f "$APP_DIR/styles.css" "$BUILD_DIR/" || true

# 필수 파일 점검
[ -f "$BUILD_DIR/index.html" ] || { echo "index.html 이 없습니다."; exit 1; }
[ -f "$BUILD_DIR/app.js" ]     || { echo "app.js 가 없습니다."; exit 1; }

echo "==> sync to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$BUILD_DIR/" "$WEB_ROOT/"

# 권한 정리
sudo chown -R www-data:www-data "$WEB_ROOT"

# 디버깅용 정보
COMMIT="$(cd "$APP_DIR" && git rev-parse --short HEAD 2>/dev/null || echo unknown)"
DATE_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
sudo tee "$WEB_ROOT/.deploy-info" >/dev/null <<INFO
frontend_commit=$COMMIT
deployed_at=$DATE_UTC
INFO

echo "[OK] Frontend deployed (plain)"
