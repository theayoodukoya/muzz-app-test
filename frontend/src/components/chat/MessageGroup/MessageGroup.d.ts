import type { Message } from '@/store/slices/messagesSlice';
type MessageGroupProps = {
    messages: Message[];
    highlightedMessageId?: number;
};
declare const MessageGroup: import("react").ForwardRefExoticComponent<MessageGroupProps & import("react").RefAttributes<HTMLDivElement>>;
export default MessageGroup;
