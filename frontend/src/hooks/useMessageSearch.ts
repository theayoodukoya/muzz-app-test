import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';

export const useMessageSearch = (query: string, currentUserId: number) => {
  const allMessages = useAppSelector((state) => state.messages.messages);

  const searchResults = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    // Filter messages that involve the current user
    const userMessages = allMessages.filter(
      (message) =>
        (message.senderId === currentUserId ||
          message.recipientId === currentUserId) &&
        message.content &&
        message.content.trim().length > 0
    );

    // Enhanced search logic
    const results = userMessages.filter((message) => {
      const messageContent = message.content.toLowerCase();

      // 1. Exact phrase match (highest priority)
      if (messageContent.includes(searchTerm)) {
        return true;
      }

      // 2. All words present (any order)
      const searchWords = searchTerm
        .split(/\s+/)
        .filter((word) => word.length > 0);
      if (searchWords.length > 1) {
        const allWordsPresent = searchWords.every((word) =>
          messageContent.includes(word)
        );
        if (allWordsPresent) {
          return true;
        }
      }

      // 3. Partial word matching (for typos)
      if (searchWords.length === 1) {
        const word = searchWords[0];
        if (word.length >= 3) {
          // Check if any word in the message starts with the search term
          const messageWords = messageContent.split(/\s+/);
          return messageWords.some(
            (messageWord) =>
              messageWord.startsWith(word) ||
              word.startsWith(
                messageWord.substring(0, Math.min(3, messageWord.length))
              )
          );
        }
      }

      return false;
    });

    // Sort by relevance
    return results.sort((a, b) => {
      const aContent = a.content.toLowerCase();
      const bContent = b.content.toLowerCase();

      // Exact matches first
      const aExact = aContent.includes(searchTerm) ? 1 : 0;
      const bExact = bContent.includes(searchTerm) ? 1 : 0;

      if (aExact !== bExact) {
        return bExact - aExact;
      }

      // Then by timestamp (most recent first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [query, allMessages, currentUserId]);

  return {
    results: searchResults,
    isLoading: false,
    error: null,
  };
};
