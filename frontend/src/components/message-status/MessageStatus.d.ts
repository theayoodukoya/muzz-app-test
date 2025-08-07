import type { MessageStatus } from '@/store/slices/messagesSlice';
interface MessageStatusProps {
    status?: MessageStatus;
    isOwnMessage: boolean;
}
declare const MessageStatusComponent: ({ status, isOwnMessage, }: MessageStatusProps) => import("react").JSX.Element | null;
export default MessageStatusComponent;
