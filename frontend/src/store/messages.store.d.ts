export type Message = {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: string;
};
export type MessageInput = {
    senderId: number;
    recipientId: number;
    content: string;
};
type MessagesState = {
    messages: Message[];
    createMessage: (message: MessageInput) => void;
    addMessage: (message: Message) => void;
};
declare const useMessagesStore: import("zustand").UseBoundStore<import("zustand").StoreApi<MessagesState>>;
export default useMessagesStore;
