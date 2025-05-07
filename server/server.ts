/**
 * Main gRPC server implementation that hosts multiple services.
 * This server implements both the Greeter and Status services.
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { SayHello } from './greeterService';
import { UpdateStatus } from './statusService';

// Proto loader options for proper type handling and case preservation
const protoOptions: protoLoader.Options = {
  keepCase: true,  // Maintain original case from proto files
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

// Load proto file paths relative to current directory
const HELLO_PROTO_PATH = path.join(__dirname, '../protos/hello.proto');
const STATUS_PROTO_PATH = path.join(__dirname, '../protos/status.proto');

// Load and parse protocol buffer definitions
const helloPackageDef = protoLoader.loadSync(HELLO_PROTO_PATH, protoOptions);
const statusPackageDef = protoLoader.loadSync(STATUS_PROTO_PATH, protoOptions);

// Create gRPC objects from the proto definitions
const grpcObj = grpc.loadPackageDefinition(helloPackageDef) as any;
const statusGrpcObj = grpc.loadPackageDefinition(statusPackageDef) as any;

// Get service definitions
const greeter = grpcObj.hello.Greeter;
const statusService = statusGrpcObj.status.StatusService;

// Create new gRPC server instance
const server = new grpc.Server();

// Register service implementations
server.addService(greeter.service, { SayHello });
server.addService(statusService.service, { UpdateStatus });

// Start server on port 50051
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('✅ gRPC Server running at http://0.0.0.0:50051');
});