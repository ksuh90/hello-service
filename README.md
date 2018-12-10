# jwt auth
This project consists of two parts. The _server_ and _client_.

## How to run
Clone the repository.
```
$ git clone https://github.com/ksuh90/hello-service.git
```

- From the root of each part(```./server``` or ```./client```), run: ```$ docker-compose up```

## Notes
The _client_ app( _localhost:6021_ ) is essentially a wrapper around the gRPC client. You may pass auth header(basic) via http to the _client_( /hello ) and it will perform a gRPC request to the _server_ and return the response.

## Specs
- Nodejs, restify, gRPC
- mocha, chai, sinon
