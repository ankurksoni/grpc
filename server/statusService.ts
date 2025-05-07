import * as grpc from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';

interface StatusRequest {
    user_id: string;
    status_message: string;
}

interface StatusResponse {
    success: boolean;
    timestamp: string;
}

export function UpdateStatus(
    call: ServerUnaryCall<StatusRequest, StatusResponse>,
    callback: sendUnaryData<StatusResponse>
) {
    console.log('📥 Raw Request:', call.request);
    console.log('📥 Request Keys:', Object.keys(call.request));
    
    // Extract fields, checking both snake_case and camelCase
    const userId = call.request.user_id ?? (call.request as any).userId;
    const statusMessage = call.request.status_message ?? (call.request as any).statusMessage;
    
    console.log('Extracted values:', { userId, statusMessage });

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
        
        console.log('📤 Sending Response:', response);
        callback(null, response);
    } catch (error) {
        console.error('❌ Internal Error:', error);
        callback({
            code: grpc.status.INTERNAL,
            message: 'Internal server error while updating status'
        });
    }
} 