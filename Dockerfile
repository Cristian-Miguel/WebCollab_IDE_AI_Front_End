# ====================================================================
# STAGE 1: BUILDER
# ====================================================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ====================================================================
# STAGE 2: Servidor Web sin root (Nginx Unprivileged)
# ====================================================================
FROM nginxinc/nginx-unprivileged:alpine

# Copiar configuración de proxy inverso y SPA fallback reemplazando el default de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los estáticos generados al directorio de Nginx con permisos del usuario nginx
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# El usuario 'nginx' ya está activo por defecto en esta imagen base
EXPOSE 80
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
