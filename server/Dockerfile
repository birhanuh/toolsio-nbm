FROM node:9
WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install 
COPY dist ./dist
COPY config ./config
COPY wait-for-it.sh .
CMD node dist/index.js