/**
 * Status Service Implementation
 * Handles user status updates and provides response with timestamp
 */

import * as grpc from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { StatusResponse, StatusRequest} from '../lib/utils';

/**
 * Updates a user's status
 * @param call - gRPC call object containing the request
 * @param callback - Callback to send the response
 */
export function UpdateStatus(
    call: ServerUnaryCall<StatusRequest, StatusResponse>,
    callback: sendUnaryData<StatusResponse>
) {
    // Extract fields, checking both snake_case and camelCase
    const userId = call.request.user_id ?? (call.request as any).userId;
    const statusMessage = call.request.status_message ?? (call.request as any).statusMessage;
    
    // Input validation
    if (!userId?.trim()) {
        console.error('❌ Validation Error: Missing user_id');
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'User ID is required'
        });
        return;
    }

    if (!statusMessage?.trim()) {
        console.error('❌ Validation Error: Missing status_message');
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'Status message is required'
        });
        return;
    }

    try {
        // Process the status update
        const response: StatusResponse = {
            success: true,
            timestamp: new Date().toISOString()
        };
        callback(null, response);
    } catch (error) {
        console.error('❌ Internal Error:', error);
        callback({
            code: grpc.status.INTERNAL,
            message: 'Internal server error while updating status'
        });
    }
} 