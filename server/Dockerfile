FROM node:8 as base
ENV PROJECT_ROOT /opt/app
WORKDIR $PROJECT_ROOT
COPY start.sh package.json .env hello.proto index.js server.js $PROJECT_ROOT/
COPY test $PROJECT_ROOT/test

# Test container
FROM base
WORKDIR $PROJECT_ROOT
RUN npm i --silent && npm run test-min

# Container to be deployed
FROM base
CMD ["./start.sh"]
