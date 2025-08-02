import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import MessageSearch from './MessageSearch';
import { createMockStore } from '@/test/utils/mock-store';
import type { Message } from '@/store/slices/messagesSlice';

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 2,
    recipientId: 1,
    content: 'Hello world test message',
    timestamp: '2024-01-01T10:00:00Z',
  },
];

const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  onMessageSelect: vi.fn(),
};

describe('MessageSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input when open', () => {
    const store = createMockStore({
      user: {
        currentUser: {
          id: 1,
          name: 'Test User',
          profile: 'https://example.com/test.jpg',
        },
      },
      messages: {
        messages: mockMessages,
      },
    });

    render(
      <Provider store={store}>
        <MessageSearch {...mockProps} />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Search messages/)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const store = createMockStore({
      user: {
        currentUser: {
          id: 1,
          name: 'Test User',
          profile: 'https://example.com/test.jpg',
        },
      },
      messages: {
        messages: mockMessages,
      },
    });

    render(
      <Provider store={store}>
        <MessageSearch {...mockProps} isOpen={false} />
      </Provider>
    );

    expect(
      screen.queryByPlaceholderText(/Search messages/)
    ).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const store = createMockStore({
      user: {
        currentUser: {
          id: 1,
          name: 'Test User',
          profile: 'https://example.com/test.jpg',
        },
      },
      messages: {
        messages: mockMessages,
      },
    });

    render(
      <Provider store={store}>
        <MessageSearch {...mockProps} />
      </Provider>
    );

    const closeButton = screen.getByLabelText('Close search');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});
