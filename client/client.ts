import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../protos/hello.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const greeter = new grpcObj.hello.Greeter('localhost:50051', grpc.credentials.createInsecure());

greeter.SayHello({ name: 'Ankur' }, (err: any, response: any) => {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log('🟢 Greeting:', response.message);
  }
});
