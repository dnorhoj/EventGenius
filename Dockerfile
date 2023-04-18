FROM node:19.6-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm i
RUN npm i -g ts-node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
