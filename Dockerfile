FROM nginx:1.21-alpine as nginx
ADD nginx/nginx.conf /etc/nginx/nginx.conf
COPY dist /app
