import type React from 'react';
import type { Message } from '@/store/slices/messagesSlice';
interface MessageSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onMessageSelect: (message: Message) => void;
}
declare const MessageSearch: ({ isOpen, onClose, onMessageSelect, }: MessageSearchProps) => React.JSX.Element | null;
export default MessageSearch;
