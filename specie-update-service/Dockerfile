FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4000

CMD ["npm", "start"]