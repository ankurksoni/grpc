import express from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { StatusRequest, StatusResponse } from '../lib/utils';
import { GrpcConnectionWatcher, ConnectionState } from '../lib/GrpcConnectionWatcher';

const app = express();
const PORT = 3000;

// Load proto file
const PROTO_PATH = path.join(__dirname, '../protos/status.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

// Create gRPC client
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
let statusService = getStatusService();
const connectionWatcher = new GrpcConnectionWatcher(statusService, {
    checkInterval: 3000,
    maxRetries: -1,
    retryDelay: 1000
});

function getStatusService() {
    return new grpcObj.status.StatusService(
        'localhost:50051',
        grpc.credentials.createInsecure(),
        {
            'grpc.keepalive_time_ms': 10000,
            'grpc.keepalive_timeout_ms': 5000,
            'grpc.keepalive_permit_without_calls': 1
        }
    );
}

// Setup connection watcher events
connectionWatcher.on('stateChanged', (state: ConnectionState) => {
    console.log('gRPC connection state changed:', state);
});

connectionWatcher.on('error', (error: Error) => {
    console.error('gRPC connection error:', error);
});

connectionWatcher.on('reconnecting', (attempt: number) => {
    console.log(`Attempting to reconnect (attempt ${attempt})...`);
});

connectionWatcher.on('reconnected', () => {
    console.log('Successfully reconnected to gRPC service');
    statusService = getStatusService();
});

// Start the connection watcher
connectionWatcher.start();

// GET /status endpoint
app.get('/status', (req, res) => {
    const userId = req.query.userId as string;
    const message = req.query.message as string;

    // Basic input validation
    if (!userId || !message) {
        return res.status(400).json({
            error: 'userId and message are required query parameters'
        });
    }

    // Check connection state before making the call
    if (connectionWatcher.getCurrentState() !== ConnectionState.READY) {
        return res.status(503).json({
            error: 'gRPC service not available',
            state: connectionWatcher.getCurrentState()
        });
    }

    const request: StatusRequest = {
        user_id: userId,
        status_message: message
    };

    // Make gRPC call
    statusService.UpdateStatus(request, (err: grpc.ServiceError | null, response: StatusResponse) => {
        if (err) {
            if (err.code === grpc.status.UNAVAILABLE) {
                return res.status(503).json({
                    error: 'gRPC service not connected'
                });
            }
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(response);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gRPC connection watcher...');
    connectionWatcher.stop();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
}); 