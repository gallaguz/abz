FROM node:20-alpine AS build-stage

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production-stage

WORKDIR /usr/src/app
COPY package*.json ./
#COPY --chown=node:node package*.json ./
RUN npm install --omit=dev --no-cache
COPY --from=build-stage /usr/src/app/dist ./dist
#COPY --chown=node:node --from=build-stage /usr/src/app/dist ./dist
# RUN chown -R node:node /usr/src/app
#USER node
CMD ["npm", "run", "start:prod"]
