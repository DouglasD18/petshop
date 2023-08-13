FROM node:18.12-alpine

WORKDIR /server-api

COPY ./package.json .

RUN npm install --omit=dev

COPY . .