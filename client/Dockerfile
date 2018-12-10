FROM node:8
ENV PROJECT_ROOT /opt/app
WORKDIR $PROJECT_ROOT
COPY start.sh package.json .env hello.proto index.js $PROJECT_ROOT/
CMD ["./start.sh"]
