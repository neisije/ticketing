FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install -g npm@9.8.0 --only=prod
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]