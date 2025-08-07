interface UseTypingIndicatorProps {
    isConnected: boolean;
    sendTypingStatus: (isTyping: boolean) => void;
}
export declare const useTypingIndicator: ({ isConnected, sendTypingStatus, }: UseTypingIndicatorProps) => {
    startTyping: () => void;
    stopTyping: () => void;
};
export {};
