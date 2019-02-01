FROM node:latest

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app



# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/src/app
ADD . /usr/src/app

ARG VUE_APP_BASE_URL 
ARG VUE_APP_BACKUP_URL

RUN npm run build
RUN rm -rf ./build
RUN rm -rf ./test
ENV PORT=9707
EXPOSE 9707
CMD [ "npm", "run", "serve" ]