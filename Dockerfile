# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Install backend deps
FROM node:20-alpine AS backend-deps
WORKDIR /build
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Stage 3: Production
FROM node:20-alpine
RUN apk add --no-cache nginx supervisor wget

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf
RUN rm -f /etc/nginx/http.d/default.conf.bak

# Copy supervisord config
COPY supervisord.conf /etc/supervisord.conf

# Copy built frontend
COPY --from=frontend-build /build/dist /usr/share/nginx/html

# Copy backend
WORKDIR /app/backend
COPY --from=backend-deps /build/node_modules ./node_modules
COPY backend/ ./

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q --spider http://localhost/health || exit 1

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
