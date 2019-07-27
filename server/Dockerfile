FROM node
WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./migrations ./migrations
COPY ./emails ./emails
COPY ./dist ./dist
COPY ./config ./config
COPY ./wait-for-it.sh .

RUN npm install --production
ENV NODE_ENV production

RUN ls -al
#RUN pwd
#CMD node dist/index.js

USER node