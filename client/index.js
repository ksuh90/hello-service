require('dotenv').config();
const restify = require('restify');
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

const client = new hello_proto.Hello(
    `${process.env.SERVER_ADDR}:6020`,
    grpc.credentials.createInsecure()
);

const controller = function(req, res, next) {
    let message;
    const authHeaderValue = req.header('Authorization');
    const metadata = new grpc.Metadata();
    metadata.add('Authorization', `${authHeaderValue}`);
    client.sayHello({}, metadata, function(err, response) {
        if (err) {
            console.log(err.message);
            message = err.message;
        } else {
            console.log(response.message);
            message = response.message;
        }
        res.send({ message });
        next();
    });
};

// Instantiate restify server
const server = restify.createServer();
server.get('/', function(req, res, next){
    res.send({
        name: 'Hello API client',
        description: 'Pass a jwt via bearer to /hello'
    });
    next();
});
server.get('/hello', controller);

if (!module.parent){
    server.listen(process.env.CLIENT_PORT, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}
