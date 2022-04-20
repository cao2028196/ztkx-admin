FROM node:14-alpine as builder

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk add --update --no-cache \
    python3 \
    python3-dev \
    py-pip \
    gcc g++ make libffi-dev openssl-dev libtool \
    && rm -rf /var/cache/apk/*

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn 

COPY . .
ARG BRANCH=$BRANCH
RUN yarn build:${BRANCH}

FROM nginx:1.21-alpine as nginx
ADD nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist /app
