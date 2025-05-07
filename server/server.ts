import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { SayHello } from './greeterService';
import { UpdateStatus } from './statusService';

// Proto loader options
const protoOptions: protoLoader.Options = {
  keepCase: true,  // Maintain original case from proto files
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

// Load both proto files
const HELLO_PROTO_PATH = path.join(__dirname, '../protos/hello.proto');
const STATUS_PROTO_PATH = path.join(__dirname, '../protos/status.proto');

// Load package definitions with options
const helloPackageDef = protoLoader.loadSync(HELLO_PROTO_PATH, protoOptions);
const statusPackageDef = protoLoader.loadSync(STATUS_PROTO_PATH, protoOptions);

// Load gRPC objects
const grpcObj = grpc.loadPackageDefinition(helloPackageDef) as any;
const statusGrpcObj = grpc.loadPackageDefinition(statusPackageDef) as any;

const greeter = grpcObj.hello.Greeter;
const statusService = statusGrpcObj.status.StatusService;

const server = new grpc.Server();

// Add both services
server.addService(greeter.service, { SayHello });
server.addService(statusService.service, { UpdateStatus });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('✅ gRPC Server running at http://0.0.0.0:50051');
  server.start();
});