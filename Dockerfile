FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN command -v ng >/dev/null 2>&1 || (npm install -g @angular/cli && chmod +x /usr/local/bin/ng)
RUN ng build --configuration=production

FROM nginx:stable-alpine
COPY --from=build /app/dist/e-commerce-fe /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
