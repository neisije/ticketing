FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install -g npm@9.8.1 --omit=dev
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]