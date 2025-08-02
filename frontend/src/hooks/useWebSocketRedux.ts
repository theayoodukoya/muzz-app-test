import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addMessage } from '@/store/slices/messagesSlice';
import { setConnectionStatus } from '@/store/slices/chatSlice';
import type { Message } from '@/store/slices/messagesSlice';

interface UseWebSocketReduxProps {
  userId: number;
  recipientId: number | null;
}

export const useWebSocketRedux = ({
  userId,
  recipientId,
}: UseWebSocketReduxProps) => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const currentConversationRef = useRef<string | null>(null);

  useEffect(() => {
    dispatch(setConnectionStatus('connecting'));

    // Initialize socket connection
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      dispatch(setConnectionStatus('connected'));
      console.log(
        '[WebSocket] Connected to server with ID:',
        socketRef.current?.id
      );

      // Rejoin conversation if we have one
      if (currentConversationRef.current) {
        socketRef.current?.emit(
          'join-conversation',
          currentConversationRef.current
        );
        console.log(
          '[WebSocket] Rejoined conversation:',
          currentConversationRef.current
        );
      }
    });

    socketRef.current.on('disconnect', (reason) => {
      setIsConnected(false);
      dispatch(setConnectionStatus('disconnected'));
      console.log('[WebSocket] Disconnected from server. Reason:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      dispatch(setConnectionStatus('error'));
      console.error('[WebSocket] Connection error:', error);
    });

    socketRef.current.on('new-message', (message: Message) => {
      console.log('[WebSocket] Received new message:', message);

      // Validate message structure
      if (!message.id || !message.timestamp || !message.content) {
        console.error('[WebSocket] Invalid message received:', message);
        return;
      }

      // Only add messages that are part of current conversation
      if (
        (message.senderId === userId && message.recipientId === recipientId) ||
        (message.senderId === recipientId && message.recipientId === userId)
      ) {
        dispatch(addMessage(message));
      }
    });

    return () => {
      console.log('[WebSocket] Cleaning up connection');
      socketRef.current?.disconnect();
    };
  }, [dispatch, userId, recipientId]);

  // Handle conversation joining
  useEffect(() => {
    if (socketRef.current && recipientId && isConnected) {
      const conversationId = `${Math.min(userId, recipientId)}-${Math.max(
        userId,
        recipientId
      )}`;
      currentConversationRef.current = conversationId;

      socketRef.current.emit('join-conversation', conversationId);
      console.log(`[WebSocket] ✅ JOINED conversation: ${conversationId}`);
    }
  }, [userId, recipientId, isConnected, dispatch]);

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socketRef.current && isConnected) {
      console.log('[WebSocket] ✅ SENDING message:', message);
      socketRef.current.emit('send-message', message);
    } else {
      console.warn(
        '[WebSocket] ❌ Cannot send message: WebSocket not connected'
      );
    }
  };

  return { isConnected, sendMessage };
};
