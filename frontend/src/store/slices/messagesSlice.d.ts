export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export interface Message {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: string;
    status?: MessageStatus;
}
export interface MessageInput {
    senderId: number;
    recipientId: number;
    content: string;
}
export interface MessagesState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}
export declare const sendMessage: import("@reduxjs/toolkit").AsyncThunk<Message, MessageInput, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const addMessage: import("@reduxjs/toolkit").ActionCreatorWithPayload<Message, "messages/addMessage">, updateMessageStatus: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    messageId: number;
    status: MessageStatus;
}, "messages/updateMessageStatus">, markMessagesAsRead: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    senderId: number;
    recipientId: number;
}, "messages/markMessagesAsRead">, clearMessages: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"messages/clearMessages">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "messages/setError">, clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"messages/clearError">;
declare const _default: import("redux").Reducer<MessagesState>;
export default _default;
