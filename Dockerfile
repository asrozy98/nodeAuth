FROM node:alpine

WORKDIR /nodeAuth

RUN npm install i npm@latest -g 
RUN npm install i nodemon@latest -g 

COPY package.json .

RUN npm install

COPY . .

CMD nodemon app
