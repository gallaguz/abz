FROM node:20 AS build-stage

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run generate
RUN npm run build

FROM node:20-alpine AS production-stage

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev --no-cache
COPY --from=build-stage /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build-stage /usr/src/app/dist ./dist

#USER node

CMD npm run start
