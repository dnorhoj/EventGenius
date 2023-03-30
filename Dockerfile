FROM node:19.6-alpine as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:19.6-alpine

COPY --from=build /app/dist /app

WORKDIR /app

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
