/**
 * Status Service gRPC Client
 * Demonstrates JSON object handling in gRPC communication
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load proto file path relative to current directory
const PROTO_PATH = path.join(__dirname, '../protos/status.proto');

// Proto loader options for proper type handling and case preservation
const protoOptions: protoLoader.Options = {
  keepCase: true,  // This ensures field names keep their original case
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

// Load and parse protocol buffer definition
const packageDef = protoLoader.loadSync(PROTO_PATH, protoOptions);

// Create gRPC client object
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

// Initialize Status service client
const statusService = new grpcObj.status.StatusService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Create status request with snake_case keys to match proto definition
const statusRequest = {
  user_id: 'user123',           // snake_case to match proto
  status_message: 'Working on gRPC implementation!'  // snake_case to match proto
};

// Make the RPC call
statusService.UpdateStatus(statusRequest, (err: any, response: any) => {
  if (err) {
    console.error('❌ Status Error:', err.message);
    console.error('Error Details:', err);
    return;
  }
  console.log('📥 Received Status Response:', JSON.stringify(response, null, 2));
}); 