// Centralized type definitions
export interface User {
  id: number;
  name: string;
  profile: string;
}

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

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type Route = 'home' | 'chat' | 'profile';

export interface ChatTabProps {
  highlightedMessageId?: number;
  onScrollToMessage?: (messageId: number) => void;
}

export interface MessageSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSelect: (message: Message) => void;
}
