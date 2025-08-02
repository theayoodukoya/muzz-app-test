import { create } from 'zustand';

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

// Sample messages to demonstrate grouping functionality
const sampleMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    recipientId: 2,
    content: 'Hey John! How are you doing?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    senderId: 2,
    recipientId: 1,
    content: "Hi Alisha! I'm doing great, thanks for asking!",
    timestamp: new Date(
      Date.now() - 2 * 60 * 60 * 1000 + 10 * 1000
    ).toISOString(), // 2 hours ago + 10 seconds
  },
  {
    id: 3,
    senderId: 2,
    recipientId: 1,
    content: 'How about you?',
    timestamp: new Date(
      Date.now() - 2 * 60 * 60 * 1000 + 15 * 1000
    ).toISOString(), // 2 hours ago + 15 seconds
  },
  {
    id: 4,
    senderId: 1,
    recipientId: 2,
    content: "I'm doing well too! Just working on some projects.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 5,
    senderId: 1,
    recipientId: 3,
    content: 'Hi Maddie! Want to grab coffee later?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
  {
    id: 6,
    senderId: 3,
    recipientId: 1,
    content: 'That sounds great! What time works for you?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
  },
];

const useMessagesStore = create<MessagesState>()((set, get) => ({
  messages: sampleMessages,
  createMessage: (message: MessageInput) =>
    set((state) => {
      const newMessage: Message = {
        id: Math.max(...state.messages.map((m) => m.id), 0) + 1,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        timestamp: new Date().toISOString(),
      };
      console.log('Creating local message:', newMessage);
      return { messages: [...state.messages, newMessage] };
    }),
  addMessage: (message: Message) =>
    set((state) => {
      // Check for duplicate by ID AND content to avoid false positives
      const messageExists = state.messages.some(
        (m) =>
          m.id === message.id ||
          (m.content === message.content &&
            m.senderId === message.senderId &&
            Math.abs(
              new Date(m.timestamp).getTime() -
                new Date(message.timestamp).getTime()
            ) < 5000)
      );

      if (messageExists) {
        console.log(
          'Message already exists, skipping:',
          message.id,
          message.content
        );
        return state;
      }

      console.log('Adding WebSocket message to store:', message);
      return { messages: [...state.messages, message] };
    }),
}));

export default useMessagesStore;
