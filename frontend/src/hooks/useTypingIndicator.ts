import { useEffect, useRef, useCallback } from 'react';

interface UseTypingIndicatorProps {
  isConnected: boolean;
  sendTypingStatus: (isTyping: boolean) => void;
}

export const useTypingIndicator = ({
  isConnected,
  sendTypingStatus,
}: UseTypingIndicatorProps) => {
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!isConnected) {
      return;
    }

    // Only send typing status if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStatus(true);
    } else {
      return;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        sendTypingStatus(false);
      }
    }, 1500);
  }, [isConnected, sendTypingStatus]);

  const stopTyping = useCallback(() => {
    if (!isConnected) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingStatus(false);
    } else {
    }
  }, [sendTypingStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send stop typing on cleanup
      if (isTypingRef.current) {
        sendTypingStatus(false);
      }
    };
  }, [sendTypingStatus]);

  return { startTyping, stopTyping };
};
