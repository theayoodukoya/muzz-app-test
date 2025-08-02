import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils';
import ChatTab from './ChatTab';
import { Provider } from 'react-redux';
import { createMockStore, type MockStore } from '@/test/utils/mock-store';
import type { Message } from '@/store/slices/messagesSlice';

// Mock WebSocket hook
vi.mock('@/hooks/useWebSocketRedux', () => ({
  useWebSocketRedux: () => ({
    sendMessage: vi.fn(),
    sendTypingStatus: vi.fn(),
  }),
}));

// Mock typing indicator hook
vi.mock('@/hooks/useTypingIndicator', () => ({
  useTypingIndicator: () => ({
    startTyping: vi.fn(),
    stopTyping: vi.fn(),
  }),
}));

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    recipientId: 2,
    content: 'Hello John!',
    timestamp: '2024-01-01T10:00:00Z',
    status: 'read',
  },
  {
    id: 2,
    senderId: 2,
    recipientId: 1,
    content: 'Hi Alisha!',
    timestamp: '2024-01-01T10:01:00Z',
  },
];

describe('ChatTab Integration', () => {
  let store: MockStore;

  beforeEach(() => {
    store = createMockStore({
      user: {
        currentUser: {
          id: 1,
          name: 'Alisha',
          profile: 'https://example.com/alisha.jpg',
        },
        currentRecipient: {
          id: 2,
          name: 'John',
          profile: 'https://example.com/john.jpg',
        },
      },
      messages: {
        messages: mockMessages,
        loading: false,
        error: null,
      },
      chat: {
        typingUsers: [],
        isConnected: true,
        connectionStatus: 'connected',
      },
    });
  });

  const renderChatTab = (props = {}) => {
    return render(
      <Provider store={store}>
        <ChatTab {...props} />
      </Provider>
    );
  };

  it('should display existing messages', () => {
    renderChatTab();

    expect(screen.getByText('Hello John!')).toBeInTheDocument();
    expect(screen.getByText('Hi Alisha!')).toBeInTheDocument();
  });

  it('should send message when form is submitted', async () => {
    renderChatTab();

    const input = screen.getByPlaceholderText('Message John');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'New test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should disable send button when input is empty', () => {
    renderChatTab();

    const sendButton = screen.getByText('Send');
    expect(sendButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Message John');
    fireEvent.change(input, { target: { value: 'Test message' } });

    expect(sendButton).toBeEnabled();
  });

  it('should show typing indicator when recipient is typing', () => {
    // Create store with typing user
    const storeWithTyping = createMockStore({
      user: {
        currentUser: {
          id: 1,
          name: 'Alisha',
          profile: 'https://example.com/alisha.jpg',
        },
        currentRecipient: {
          id: 2,
          name: 'John',
          profile: 'https://example.com/john.jpg',
        },
      },
      messages: {
        messages: mockMessages,
        loading: false,
        error: null,
      },
      chat: {
        typingUsers: [2], // John is typing
        isConnected: true,
        connectionStatus: 'connected',
      },
    });

    render(
      <Provider store={storeWithTyping}>
        <ChatTab />
      </Provider>
    );

    expect(screen.getByText('John is typing...')).toBeInTheDocument();
  });

  it('should show connection status when disconnected', () => {
    const storeDisconnected = createMockStore({
      user: {
        currentUser: {
          id: 1,
          name: 'Alisha',
          profile: 'https://example.com/alisha.jpg',
        },
        currentRecipient: {
          id: 2,
          name: 'John',
          profile: 'https://example.com/john.jpg',
        },
      },
      messages: {
        messages: mockMessages,
        loading: false,
        error: null,
      },
      chat: {
        typingUsers: [],
        isConnected: false,
        connectionStatus: 'disconnected',
      },
    });

    render(
      <Provider store={storeDisconnected}>
        <ChatTab />
      </Provider>
    );

    expect(
      screen.getByText('Connecting to real-time chat...')
    ).toBeInTheDocument();
  });
});
