import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMessageSearch } from './useMessageSearch';
import type React from 'react';
import { Provider } from 'react-redux';
import { createMockStore, type MockStore } from '@/test/utils/mock-store';
import type { Message } from '@/store/slices/messagesSlice';

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    recipientId: 2,
    content: 'Hello world',
    timestamp: '2024-01-01T10:00:00Z',
  },
  {
    id: 2,
    senderId: 2,
    recipientId: 1,
    content: 'Hi there, how are you?',
    timestamp: '2024-01-01T10:01:00Z',
  },
  {
    id: 3,
    senderId: 1,
    recipientId: 3,
    content: 'Different conversation',
    timestamp: '2024-01-01T10:02:00Z',
  },
];

describe('useMessageSearch', () => {
  let store: MockStore;

  beforeEach(() => {
    store = createMockStore({
      messages: {
        messages: mockMessages,
        loading: false,
        error: null,
      },
      user: {
        currentUser: {
          id: 1,
          name: 'Test User',
          profile: 'https://example.com/test.jpg',
        },
      },
    });
  });

  const createWrapper = (testStore: MockStore) => {
    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={testStore}>{children}</Provider>
    );
  };

  it('should return empty results for short queries', () => {
    const { result } = renderHook(() => useMessageSearch('h', 1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.results).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should find messages with exact matches', () => {
    const { result } = renderHook(() => useMessageSearch('hello', 1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].content).toBe('Hello world');
  });

  it('should only return messages involving the current user', () => {
    const { result } = renderHook(() => useMessageSearch('conversation', 1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].content).toBe('Different conversation');
  });

  it('should handle case-insensitive search', () => {
    const { result } = renderHook(() => useMessageSearch('HELLO', 1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].content).toBe('Hello world');
  });

  it('should search multiple words', () => {
    const { result } = renderHook(() => useMessageSearch('hi there', 1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].content).toBe('Hi there, how are you?');
  });

  it('should return results sorted by relevance', () => {
    const messagesWithRelevance: Message[] = [
      {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: 'Hello world',
        timestamp: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        senderId: 2,
        recipientId: 1,
        content: 'Say hello to everyone',
        timestamp: '2024-01-01T10:01:00Z',
      },
      {
        id: 3,
        senderId: 1,
        recipientId: 2,
        content: 'Hello there friend',
        timestamp: '2024-01-01T10:02:00Z',
      },
    ];

    const storeWithRelevance = createMockStore({
      messages: {
        messages: messagesWithRelevance,
      },
      user: {
        currentUser: {
          id: 1,
          name: 'Test User',
          profile: 'https://example.com/test.jpg',
        },
      },
    });

    const { result } = renderHook(() => useMessageSearch('hello', 1), {
      wrapper: createWrapper(storeWithRelevance),
    });

    expect(result.current.results).toHaveLength(3);
    // Results should be sorted by relevance (most recent first)
    expect(result.current.results[0].content).toBe('Hello there friend');
  });

  it('should handle empty search query', () => {
    const { result } = renderHook(() => useMessageSearch('', 1), {
      wrapper: createWrapper(store),
    });
    expect(result.current.results).toHaveLength(0);
  });

  it('should handle search with no results', () => {
    const { result } = renderHook(() => useMessageSearch('nonexistent', 1), {
      wrapper: createWrapper(store),
    });
    expect(result.current.results).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
