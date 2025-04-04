FROM node:lts-alpine

WORKDIR /app

COPY package*.json .

RUN npm i -g pnpm

RUN pnpm i

COPY ./ ./

RUN pnpm run build

CMD ["node", "dist/main"]
