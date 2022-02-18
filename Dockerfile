# syntax=docker/dockerfile:1

FROM node:16 as clientbuilder
ENV NODE_ENV=production



WORKDIR /app

COPY ["client/package.json", "client/yarn.lock", "./"]

RUN yarn install

COPY client .
COPY src/types/data.ts src/serverTypes.ts
COPY client/src/configProd.ts src/config.ts

WORKDIR /app

RUN yarn build

FROM node:16 as server

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install

COPY src ./src
COPY ["tsconfig.json",  "./src/"]

COPY --from=clientbuilder /app /app/client

CMD ["yarn", "run", "server-prod"]