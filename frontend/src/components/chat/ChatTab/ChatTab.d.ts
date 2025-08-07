import type React from 'react';
interface ChatTabProps {
    highlightedMessageId?: number;
    onScrollToMessage?: (messageId: number) => void;
}
declare const ChatTab: ({ highlightedMessageId, onScrollToMessage }: ChatTabProps) => React.JSX.Element;
export default ChatTab;
