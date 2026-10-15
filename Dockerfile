# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Servidor Web sin root
FROM nginxinc/nginx-unprivileged:alpine

# Copiar los estáticos generados al directorio de Nginx con permisos del usuario nginx
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# El usuario 'nginx' ya está activo por defecto en esta imagen base
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]