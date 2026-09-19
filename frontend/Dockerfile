# Stage 1: Build React SPA
FROM node:20-alpine AS build
WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm install

# Salin kode dan bangun artefak produksi
COPY . .
# Kosongkan VITE_API_BASE_URL saat build produksi agar request memakai relative path /api
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Web Server Produksi dengan Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]