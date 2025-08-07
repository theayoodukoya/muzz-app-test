import type { Message } from '@/store/slices/messagesSlice';
interface UseWebSocketReduxProps {
    userId: number;
    recipientId: number | null;
}
export declare const useWebSocketRedux: ({ userId, recipientId, }: UseWebSocketReduxProps) => {
    isConnected: boolean;
    sendMessage: (message: Omit<Message, "id" | "timestamp">) => void;
};
export {};
