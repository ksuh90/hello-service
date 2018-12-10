require('dotenv').config();
const jwt = require('jsonwebtoken');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'hello.proto';
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        defaults: true,
        oneofs: true
    }
);
const hello_proto = grpc.loadPackageDefinition(packageDefinition).hello;

const verifyAuthHeader = function(value) {
    let result = false;
    const parts = value.split(' ');
    const token = parts[1] || '';
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        result = decoded;
    } catch(err) {
        result = {err: err.message};
    }
    return result;
}

const sayHello = function(call, callback) {
    const authData = call.metadata.get('Authorization');
    if (authData.length) {
        const data = verifyAuthHeader(authData[0]);
        if (data.hasOwnProperty('err')) {
            callback({
                code: grpc.status.UNAUTHENTICATED,
                details: data.err,
            });
        } else {
            callback(null, { message: `Hello ${data.username}` });
        }
    }
}

// Configure grpc server
const port = `0.0.0.0:${process.env.PORT}`;
const server = new grpc.Server();
server.addService(hello_proto.Hello.service, { sayHello: sayHello });
server.bind(port, grpc.ServerCredentials.createInsecure());

module.exports = {
    port: port,
    server: server,
    sayHello: sayHello
}
