FROM node:14.16.1-alpine3.13

WORKDIR /bot

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
