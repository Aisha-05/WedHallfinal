#!/bin/sh

# Use Koyeb's PORT env variable if provided, otherwise default to 8000
PORT=${PORT:-8000}
sed -i "s/listen 8000/listen ${PORT}/" /etc/nginx/http.d/default.conf

# Start PHP-FPM in the background
php-fpm -D

# Start Nginx in the foreground (keeps the container alive)
nginx -g 'daemon off;'
