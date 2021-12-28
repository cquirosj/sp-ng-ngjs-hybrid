FROM nginx AS base
WORKDIR /app
RUN rm -v /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

FROM node:16.13.1-alpine As nodeJsBuilder
RUN apk update && apk add git
WORKDIR /usr/app
COPY package.json ./
COPY decorate-angular-cli.js ./
RUN npm install
COPY . .
RUN npm run build

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=nodeJsBuilder /usr/app/dist/apps/pulse .
CMD ["/usr/sbin/nginx"]
