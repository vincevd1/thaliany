FROM node:22-slim AS build

COPY client/package.json client/package-lock.json ./

RUN npm install

COPY client .

RUN npm run build


FROM jonasal/nginx-certbot:4.3-alpine AS nginx

# The nginx base image will envsubst the template with env variables at runtime and place
# it at /etc/nginx/conf.d/thaliany.conf. See https://registry.hub.docker.com/_/nginx/.
COPY infra/nginx/thaliany.conf.template /etc/nginx/templates/thaliany.conf.template
COPY --from=build /dist /volumes/client

VOLUME ["/volumes/static", "/volumes/media"]

