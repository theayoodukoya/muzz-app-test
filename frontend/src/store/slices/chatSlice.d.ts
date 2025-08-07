export interface ChatState {
    typingUsers: number[];
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}
export declare const setConnectionStatus: import("@reduxjs/toolkit").ActionCreatorWithPayload<"error" | "connecting" | "connected" | "disconnected", "chat/setConnectionStatus">, addTypingUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "chat/addTypingUser">, removeTypingUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "chat/removeTypingUser">, clearTypingUsers: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"chat/clearTypingUsers">;
declare const _default: import("redux").Reducer<ChatState>;
export default _default;
