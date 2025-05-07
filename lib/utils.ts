export type HelloRequest = {
    name: string;
};
    
export type HelloReply = {
    message: string;
};

export type StatusRequest = {
    user_id: string;
    status_message: string;
};

export type StatusResponse = {
    success: boolean;
    timestamp: string;
};