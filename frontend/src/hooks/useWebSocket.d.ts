import type { Message } from '@/store/messages.store';
interface UseWebSocketProps {
    userId: number;
    recipientId: number | null;
    onNewMessage: (message: Message) => void;
    onTypingStatus?: (userId: number, isTyping: boolean) => void;
}
export declare const useWebSocket: ({ userId, recipientId, onNewMessage, onTypingStatus, }: UseWebSocketProps) => {
    isConnected: boolean;
    sendMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    sendTypingStatus: (isTyping: boolean) => void;
};
export {};
