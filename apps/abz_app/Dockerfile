FROM node:20-alpine AS build-stage

ARG VUE_APP_API_URL
ENV VUE_APP_API_URL $VUE_APP_API_URL

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine AS production-stage

RUN mkdir -p /usr/src/app
COPY --from=build-stage /usr/src/app/dist /usr/src/app
