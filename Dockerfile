FROM nginx:1.21-alpine as nginx
ADD nginx/nginx.conf /etc/nginx/nginx.conf
COPY packages/web/dist /app
