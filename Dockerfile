FROM node:22-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache curl

WORKDIR /app

COPY ./package*.json /app/

RUN npm install; npm install -g serve@14.2.4 && npm cache clean --force

COPY . .

RUN npx nuxi generate

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["npx", "serve", "-l", "3000", "dist"]