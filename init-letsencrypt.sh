#!/bin/bash

DOMAIN="rbac.hrefdev.be"
EMAIL="me@hrefdev.be"

echo "### Creating dummy certificate for $DOMAIN ..."
mkdir -p certbot/conf/live/$DOMAIN
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
    -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Starting nginx ..."
docker compose -f docker-compose.prod.yml up -d nginx

echo "### Deleting dummy certificate for $DOMAIN ..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$DOMAIN && \
  rm -rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### Requesting Let's Encrypt certificate for $DOMAIN ..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN" certbot

echo "### Reloading nginx ..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "### Done!"