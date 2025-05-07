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

- `npm run proto:gen`: Generate TypeScript code from .proto files
- `npm run server`: Start the gRPC server
- `npm run client`: Run the hello world client

## Protocol Buffers

The project includes two proto definitions:

1. `hello.proto`: Basic greeting service
2. `status.proto`: Status update service with JSON handling

## Type Safety

The project uses TypeScript for type safety and includes:
- Strong typing for gRPC services
- Interface definitions for requests/responses
- Proper error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request