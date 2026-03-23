# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Argument de build pour l'URL de l'API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build-only

# Production stage
FROM nginx:alpine

# Copier la config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
