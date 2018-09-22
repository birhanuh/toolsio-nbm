FROM node
WORKDIR /app

COPY ./package.json .
COPY ./migrations ./migrations
COPY ./emails ./emails
COPY ./dist ./dist
COPY ./src/types ./dist/types
COPY ./config ./config
COPY ./wait-for-it.sh .
COPY ./.env .

RUN npm install --production
ENV NODE_ENV production

RUN ls -al
#RUN pwd
#CMD node dist/index.js

USER node