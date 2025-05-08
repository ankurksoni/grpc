# gRPC TypeScript Example

A simple gRPC project demonstrating multiple services using TypeScript, Node.js, and gRPC-js.

## Services

1. **Greeter Service**: A simple hello world service
2. **Status Service**: A service demonstrating JSON object handling

## Project Structure

```
.
├── protos/          # Protocol Buffer definitions
├── server/          # Server-side implementations
├── client/          # Client-side implementations
├── lib/             # Shared utilities
└── gen/             # Generated gRPC code
```

## Prerequisites

- Node.js (v14 or higher)
- TypeScript
- npm

## Installation

```bash
# Install dependencies
npm install

# Generate Protocol Buffer code
npm run proto:gen
```

## Running the Application

1. Start the server:
```bash
npm run server
```

2. Run the clients:
```bash
# Run hello world client
npm run client

# Run status client
ts-node client/statusClient.ts
```

## Available Scripts

```bash
# Generate Protocol Buffer code
npm run proto:gen

# Start the gRPC server
npm run server

# Run the hello world gRPC client
npm run client

# Run the status gRPC client
npm run status

# Alternative to above: Start the REST API server (Express)
npm run api
```

## Testing the API

Once the servers are running (both gRPC and API), you can test the endpoints using curl:

### Status Update Endpoint

```bash
# Update user status
curl "http://localhost:3000/status?userId=user123&message=Hello%20World"

# Example Response (Success):
{
  "success": true,
  "timestamp": "2024-01-01T12:00:00Z"
}

# Example Response (Service Unavailable):
{
  "error": "gRPC service not available",
  "state": "TRANSIENT_FAILURE"
}

# Example Response (Bad Request):
{
  "error": "userId and message are required query parameters"
}
```

### Running Multiple Services

1. Start the gRPC server first:
```bash
npm run server
# Output: ✅ gRPC Server running at http://0.0.0.0:50051
```

2. Start the API server in a new terminal:
```bash
npm run api
# Output: API Server running at http://localhost:3000
```

3. Test with gRPC clients or REST API:
```bash
# Using gRPC client
npm run status

# Using REST API
curl "http://localhost:3000/status?userId=test_user&message=Testing%20API"
```

## Protocol Buffers

The project includes two proto definitions:

1. `hello.proto`: Basic greeting service
2. `status.proto`: Status update service with JSON handling

## Type Safety

The project uses TypeScript for type safety and includes:
- Strong typing for gRPC services
- Interface definitions for requests/responses
- Proper error handling

## Connection Management

The project includes a robust gRPC connection watcher (`GrpcConnectionWatcher`) that handles:

### Connection States
- IDLE: Initial state
- CONNECTING: Attempting to connect
- READY: Successfully connected
- TRANSIENT_FAILURE: Temporary connection loss
- SHUTDOWN: Connection terminated

### Automatic gRPC Server Restart Detection Flow
1. Regular state polling (configurable interval)
2. Server down → TRANSIENT_FAILURE detected
3. Reconnection attempt triggered
4. Channel reset to IDLE state
5. gRPC auto-reconnection
6. Connection restored → READY state

### Events Emitted
- `stateChanged`: When connection state changes
- `reconnecting`: During reconnection attempts
- `reconnected`: When connection is restored
- `error`: On connection errors
- `maxRetriesReached`: When max retry attempts exceeded

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request