FROM node
WORKDIR /app

COPY ./package.json .
COPY ./migrations ./migrations
COPY ./dist ./dist
COPY ./config ./config
COPY ./wait-for-it.sh .
COPY ./.env .

RUN npm install --production
ENV NODE_ENV production

#RUN ls
#RUN pwd
#CMD node dist/index.js

USER node