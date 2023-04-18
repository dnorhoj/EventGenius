FROM node:19.6-alpine

WORKDIR /app

COPY package*.json ./


RUN npm i
RUN npm i -g ts-node

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
