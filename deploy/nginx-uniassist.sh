#!/usr/bin/env bash
# Apply nginx reverse-proxy + HTTPS for uniassist.app
# Run on the Vultr VM as root:
#   bash deploy/nginx-uniassist.sh

set -euo pipefail

DOMAIN="${DOMAIN:-uniassist.app}"
EMAIL="${EMAIL:-admin@${DOMAIN}}"

apt update
apt install -y nginx certbot python3-certbot-nginx

cat >/etc/nginx/sites-available/myuniassist <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Supabase auth cookies are large — tiny buffers cause HTTP 502 after Google login
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    large_client_header_buffers 4 32k;
    proxy_read_timeout 60s;
    proxy_connect_timeout 60s;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true

if [[ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]]; then
  certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect || true
else
  certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect || true
fi

systemctl restart myuniassist
systemctl reload nginx

echo "Done. Test: https://${DOMAIN}"
