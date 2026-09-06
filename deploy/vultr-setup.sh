#!/usr/bin/env bash
# Deploy MyUniAssist (Next.js) on an Ubuntu Vultr VM
# Usage:
#   1) ssh root@YOUR_IP
#   2) git clone https://github.com/simonpenguinfat/MyUniAssist.git /opt/myuniassist
#   3) cd /opt/myuniassist && bash deploy/vultr-setup.sh

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/myuniassist}"
DOMAIN="${DOMAIN:-}"
PORT="${PORT:-3000}"

echo "==> Installing Node.js 22"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "==> Installing nginx (reverse proxy)"
apt-get update
apt-get install -y nginx

cd "$APP_DIR"
npm ci
npm run build

if [[ ! -f "$APP_DIR/.env.local" && ! -f "$APP_DIR/.env.production.local" ]]; then
  echo "Create $APP_DIR/.env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

echo "==> systemd service"
cat >/etc/systemd/system/myuniassist.service <<EOF
[Unit]
Description=MyUniAssist Next.js
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${PORT}
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable myuniassist
systemctl restart myuniassist

SERVER_NAME="${DOMAIN:-_}"
cat >/etc/nginx/sites-available/myuniassist <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sfn /etc/nginx/sites-available/myuniassist /etc/nginx/sites-enabled/myuniassist
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> App should respond on http://SERVER_IP (and DOMAIN if DNS A records point here)"
echo "Optional HTTPS: apt install certbot python3-certbot-nginx && certbot --nginx -d YOUR_DOMAIN"
