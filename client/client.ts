/**
 * Hello World gRPC Client
 * Demonstrates basic gRPC communication with the Greeter service
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { HelloRequest } from '../lib/utils';

// Load proto file path relative to current directory
const PROTO_PATH = path.join(__dirname, '../protos/hello.proto');

// Load and parse protocol buffer definition
const packageDef = protoLoader.loadSync(PROTO_PATH);

// Create gRPC client object
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

// Initialize Greeter client
const greeter = new grpcObj.hello.Greeter(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Create request with user's name
const helloRequest: HelloRequest = { name: 'Ankur' };

// Make RPC call to SayHello
greeter.SayHello(helloRequest, (err: any, response: any) => {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log('🟢 Greeting:', response.message);
  }
});