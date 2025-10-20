#!/usr/bin/env bash
set -euo pipefail
cd /opt/apps/frontend
echo "==> build frontend"
npm install
npm run build
echo "==> sync to /var/www/myapp"
sudo mkdir -p /var/www/myapp
sudo rsync -a --delete dist/ /var/www/myapp/
sudo chown -R www-data:www-data /var/www/myapp
sudo nginx -t && sudo systemctl reload nginx
echo "[OK] Frontend deployed"
