FROM node:10-alpine AS BUILDER
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean
COPY . .
RUN yarn build

FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean
COPY --from=BUILDER /app/build ./build
RUN yarn install && yarn cache clean

CMD ["node", "build/bootstrap"]
