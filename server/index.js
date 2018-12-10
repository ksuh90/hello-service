const server = require('./server');

console.log(`grpc server running on port ${server.port}`)
server.server.start();
