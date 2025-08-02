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
    console.log(
      '[TypingIndicator] startTyping called, isConnected:',
      isConnected
    );

    if (!isConnected) {
      console.log('[TypingIndicator] Not connected, skipping typing status');
      return;
    }

    // Only send typing status if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStatus(true);
      console.log('[TypingIndicator] Started typing - sent status: true');
    } else {
      console.log(
        '[TypingIndicator] Already typing, not sending duplicate status'
      );
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      console.log('[TypingIndicator] Cleared existing timeout');
    }

    // Set new timeout to stop typing after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        sendTypingStatus(false);
        console.log(
          '[TypingIndicator] Stopped typing (timeout) - sent status: false'
        );
      }
    }, 1500);
  }, [isConnected, sendTypingStatus]);

  const stopTyping = useCallback(() => {
    console.log(
      '[TypingIndicator] stopTyping called, current isTyping:',
      isTypingRef.current
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      console.log('[TypingIndicator] Cleared timeout');
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingStatus(false);
      console.log(
        '[TypingIndicator] Stopped typing (manual) - sent status: false'
      );
    } else {
      console.log(
        '[TypingIndicator] Was not typing, no need to send stop status'
      );
    }
  }, [sendTypingStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[TypingIndicator] Cleanup - unmounting');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send stop typing on cleanup
      if (isTypingRef.current) {
        sendTypingStatus(false);
        console.log('[TypingIndicator] Cleanup - sent stop typing');
      }
    };
  }, [sendTypingStatus]);

  return { startTyping, stopTyping };
};
