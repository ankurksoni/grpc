import * as grpc from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { HelloReply, HelloRequest } from '../lib/utils';

export function SayHello(
    call: ServerUnaryCall<HelloRequest, HelloReply>,
    callback: sendUnaryData<HelloReply>
) {
    const name = call.request?.name?.trim();
    if (!name || name === '') {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'Name is required OR Name cannot be empty.'
        });
        return;
    }
    callback(null, { message: `Hello, ${name}!` });
}