import * as grpc from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';

type HelloRequest = {
  name: string;
};

type HelloReply = {
  message: string;
};

export const GreeterService = {
    SayHello: (
        call: ServerUnaryCall<HelloRequest, HelloReply>,
        callback: sendUnaryData<HelloReply>
    ) => {
        const name = call.request?.name?.trim();
        if (!name) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Name is required.'
            });
            return;
        }
        if (name === '') {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Name cannot be empty.'
            });
            return;
        }
        if (name.length > 100) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Name is too long. Maximum 100 characters allowed.'
            });
            return;
        }
        if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Name contains invalid characters. Only alphanumeric, spaces, hyphens and underscores allowed.'
            });
            return;
        }
        callback(null, { message: `Hello, ${name}!` });
    },
}; 