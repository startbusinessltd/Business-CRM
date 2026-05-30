#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_HOST:?DEPLOY_HOST is required}"
: "${DEPLOY_USER:?DEPLOY_USER is required}"
: "${DEPLOY_KEY_PATH:?DEPLOY_KEY_PATH is required}"

BUILD_DIR="${BUILD_DIR:-dist}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/businesscrm.co.in/current}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_APP_PORT="${DEPLOY_APP_PORT:-3000}"
WEB_SERVER="${WEB_SERVER:-nginx}"
NGINX_SITE_PATH="${NGINX_SITE_PATH:-/etc/nginx/conf.d/businesscrm.conf}"
WORK_DIR="${WORK_DIR:-.deploy-work}"
PACKAGE_DIR="$WORK_DIR/package"
ARCHIVE_PATH="$WORK_DIR/businesscrm-release.tgz"
REMOTE_ARCHIVE="businesscrm-release.tgz"
REMOTE_DIR="businesscrm-release"

rm -rf "$WORK_DIR"
mkdir -p "$PACKAGE_DIR/app/dist" "$PACKAGE_DIR/app/scripts" "$PACKAGE_DIR/config"

rsync -a --delete "$BUILD_DIR/" "$PACKAGE_DIR/app/dist/"
cp package.json "$PACKAGE_DIR/app/package.json"
if [ -f package-lock.json ]; then
  cp package-lock.json "$PACKAGE_DIR/app/package-lock.json"
fi
cp scripts/start-server.mjs "$PACKAGE_DIR/app/scripts/start-server.mjs"
cp .deploy/apache/.htaccess "$PACKAGE_DIR/app/.htaccess"
cp .deploy/nginx/businesscrm.co.in.conf "$PACKAGE_DIR/config/businesscrm.conf.template"
cp .deploy/systemd/businesscrm.service "$PACKAGE_DIR/config/businesscrm.service.template"

tar -C "$PACKAGE_DIR" -czf "$ARCHIVE_PATH" .

SSH_TARGET="$DEPLOY_USER@$DEPLOY_HOST"
SSH_OPTS=( -i "$DEPLOY_KEY_PATH" -p "$DEPLOY_PORT" -o StrictHostKeyChecking=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=10 )
SCP_OPTS=( -i "$DEPLOY_KEY_PATH" -P "$DEPLOY_PORT" -o StrictHostKeyChecking=yes )

scp "${SCP_OPTS[@]}" "$ARCHIVE_PATH" "$SSH_TARGET:$REMOTE_ARCHIVE"

ssh "${SSH_OPTS[@]}" "$SSH_TARGET" \
  DEPLOY_PATH="'${DEPLOY_PATH}'" \
  DEPLOY_USER="'${DEPLOY_USER}'" \
  DEPLOY_APP_PORT="'${DEPLOY_APP_PORT}'" \
  WEB_SERVER="'${WEB_SERVER}'" \
  NGINX_SITE_PATH="'${NGINX_SITE_PATH}'" \
  REMOTE_ARCHIVE="'${REMOTE_ARCHIVE}'" \
  REMOTE_DIR="'${REMOTE_DIR}'" \
  'bash -s' <<'REMOTE'
set -euo pipefail

install_packages() {
  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nginx rsync tar nodejs
  elif command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y nginx rsync tar nodejs npm
  else
    echo "Unsupported package manager" >&2
    exit 1
  fi
}

echo "Installing server packages..."
install_packages

echo "Uploading release to $DEPLOY_PATH..."
rm -rf "$HOME/$REMOTE_DIR"
mkdir -p "$HOME/$REMOTE_DIR"
tar -xzf "$HOME/$REMOTE_ARCHIVE" -C "$HOME/$REMOTE_DIR"

sudo mkdir -p "$DEPLOY_PATH"
sudo rsync -a --delete "$HOME/$REMOTE_DIR/app/" "$DEPLOY_PATH/"
sudo chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_PATH"

echo "Installing production dependencies..."
cd "$DEPLOY_PATH"
if [ -f package-lock.json ]; then
  npm ci --omit=dev --no-audit --no-fund
else
  npm install --omit=dev --no-audit --no-fund
fi

echo "Refreshing service configuration..."
sudo sed \
  -e "s|__DEPLOY_USER__|$DEPLOY_USER|g" \
  -e "s|__DEPLOY_PATH__|$DEPLOY_PATH|g" \
  -e "s|__APP_PORT__|$DEPLOY_APP_PORT|g" \
  "$HOME/$REMOTE_DIR/config/businesscrm.service.template" | sudo tee /etc/systemd/system/businesscrm.service >/dev/null

if [ "$WEB_SERVER" = "nginx" ]; then
  sudo sed \
    -e "s|__DEPLOY_PATH__|$DEPLOY_PATH|g" \
    -e "s|__APP_PORT__|$DEPLOY_APP_PORT|g" \
    "$HOME/$REMOTE_DIR/config/businesscrm.conf.template" | sudo tee "$NGINX_SITE_PATH" >/dev/null
  sudo nginx -t
  sudo systemctl enable nginx
  sudo systemctl reload nginx
fi

echo "Restarting application service..."
sudo systemctl daemon-reload
sudo systemctl enable businesscrm.service
sudo systemctl restart businesscrm.service

rm -f "$HOME/$REMOTE_ARCHIVE"
rm -rf "$HOME/$REMOTE_DIR"
REMOTE

rm -rf "$WORK_DIR"

echo "Deployment completed successfully."
