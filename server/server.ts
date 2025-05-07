import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../protos/hello.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const greeter = grpcObj.hello.Greeter;

const server = new grpc.Server();

server.addService(greeter.service, {
  SayHello: (call: any, callback: any) => {
    const name = call.request.name;
    callback(null, { message: `Hello, ${name}!` });
  },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('✅ gRPC Server running at http://0.0.0.0:50051');
  server.start();
});