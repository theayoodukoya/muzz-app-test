import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { Message } from '@/store/messages.store';

interface UseWebSocketProps {
  userId: number;
  recipientId: number | null;
  onNewMessage: (message: Message) => void;
  onTypingStatus?: (userId: number, isTyping: boolean) => void;
}

export const useWebSocket = ({
  userId,
  recipientId,
  onNewMessage,
  onTypingStatus,
}: UseWebSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('new-message', (message: Message) => {
      onNewMessage(message);
    });

    socketRef.current.on(
      'typing-status',
      ({ userId: typingUserId, isTyping }) => {
        if (onTypingStatus) {
          onTypingStatus(typingUserId, isTyping);
        }
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [onNewMessage, onTypingStatus]);

  useEffect(() => {
    if (socketRef.current && recipientId) {
      const conversationId = `${Math.min(userId, recipientId)}-${Math.max(
        userId,
        recipientId
      )}`;
      socketRef.current.emit('join-conversation', conversationId);
    }
  }, [userId, recipientId]);

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', message);
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (socketRef.current && isConnected && recipientId) {
      const conversationId = `${Math.min(userId, recipientId)}-${Math.max(
        userId,
        recipientId
      )}`;

      socketRef.current.emit('typing-status', {
        conversationId,
        userId,
        isTyping,
      });
    }
  };

  return { isConnected, sendMessage, sendTypingStatus };
};
