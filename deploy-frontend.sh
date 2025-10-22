#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/apps/frontend"
WEB_ROOT="/var/www/myapp"
BUILD_DIR="dist"

log() { printf "\n\033[1;32m==>\033[0m %s\n" "$*"; }
fail() { printf "\n\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

cd "$APP_DIR"

log "Frontend deploy start"

# 1) 의존성 설치 (lock 있으면 ci, 없으면 install)
if [[ -f package-lock.json ]]; then
  log "npm ci (omit=dev)"
  npm ci --omit=dev || { log "npm ci 실패, npm install 시도"; npm install --omit=dev; }
else
  log "npm install (omit=dev)"
  npm install --omit=dev
fi

# 2) 빌드 (vite/기타 자동 감지)
if jq -e '.scripts.build' package.json >/dev/null 2>&1; then
  log "npm run build"
  npm run build
else
  fail "package.json scripts.build 가 없습니다. (예: \"build\":\"vite build\")"
fi

# 3) 빌드 산출물 검사
[[ -d "$BUILD_DIR" ]] || fail "$BUILD_DIR 폴더가 없습니다. 빌드 실패한 것 같습니다."
[[ -f "$BUILD_DIR/index.html" ]] || fail "$BUILD_DIR/index.html 이 없습니다. Vite 빌드 산출물 구조를 확인하세요."

# 4) 정적 파일 동기화 (덮어쓰기 + 삭제 동기화)
log "sync -> $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$BUILD_DIR"/ "$WEB_ROOT"/

# 5) 권한 통일
log "chown -> www-data"
sudo chown -R www-data:www-data "$WEB_ROOT"

# 6) 배포 메타 저장(디버깅용)
COMMIT="$(git -C "$APP_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
DATE_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
sudo tee "$WEB_ROOT/.deploy-info" >/dev/null <<INFO
frontend_commit=$COMMIT
deployed_at=$DATE_UTC
INFO
sudo chown www-data:www-data "$WEB_ROOT/.deploy-info"

# 7) (선택) gzip/brotli 생성 – nginx가 사용 중이면 이득
if command -v gzip >/dev/null; then
  log "static gzip"
  find "$WEB_ROOT" -type f -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.json' \
    | xargs -I{} bash -c 'gzip -fk "{}" || true'
fi
if command -v brotli >/dev/null; then
  log "static brotli"
  find "$WEB_ROOT" -type f -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.json' \
    | xargs -I{} bash -c 'brotli -f "{}" || true'
fi

# 8) nginx 재적용
if command -v nginx >/dev/null; then
  log "nginx reload"
  sudo nginx -t && sudo systemctl reload nginx
fi

log "Frontend deployed ✓ (commit=$COMMIT, time=$DATE_UTC)"
