# ============================================================
# Stage 1: Build the React frontend
# ============================================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY wdfrontback/frontend/package*.json ./
RUN npm ci
COPY wdfrontback/frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Production image — PHP-FPM + Nginx
# ============================================================
FROM php:8.1-fpm-alpine

# Install nginx and the PostgreSQL PDO driver
RUN apk add --no-cache nginx postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql

# ---------- Nginx config ----------
COPY nginx.conf /etc/nginx/http.d/default.conf

# ---------- Backend ----------
COPY wdfrontback/backend/ /var/www/backend/

# ---------- Frontend (built static files) ----------
COPY --from=frontend-builder /app/frontend/dist /var/www/html/

# ---------- Uploads placeholder ----------
COPY wdfrontback/uploads/ /var/www/uploads/

# ---------- Permissions ----------
RUN mkdir -p /var/www/backend/sessions \
    && chown -R www-data:www-data /var/www/backend/sessions \
    && chown -R www-data:www-data /var/www/uploads \
    && mkdir -p /run/nginx

# ---------- Start script ----------
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
