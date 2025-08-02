import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import messagesReducer, {
  addMessage,
  updateMessageStatus,
  sendMessage,
  type MessagesState,
  type Message,
  type MessageInput,
} from './messagesSlice';
import { configureStore } from '@reduxjs/toolkit';

// Create a properly typed store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      messages: messagesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for simpler test setup with non-serializable data like dates
      }),
  });
};

type TestStore = ReturnType<typeof createTestStore>;

describe('messagesSlice', () => {
  let store: TestStore;

  beforeEach(() => {
    vi.useFakeTimers();
    store = createTestStore();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should handle addMessage', () => {
      const initialState: MessagesState = {
        messages: [],
        loading: false,
        error: null,
      };

      const newMessage: Message = {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: 'Test message',
        timestamp: new Date().toISOString(),
      };

      const action = addMessage(newMessage);
      const state = messagesReducer(initialState, action);

      expect(state.messages).toHaveLength(1);
      expect(state.messages[0]).toEqual(newMessage);
    });

    it('should not add duplicate messages', () => {
      const existingMessage: Message = {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: 'Test message',
        timestamp: new Date().toISOString(),
      };

      const initialState: MessagesState = {
        messages: [existingMessage],
        loading: false,
        error: null,
      };

      const action = addMessage(existingMessage);
      const state = messagesReducer(initialState, action);

      expect(state.messages).toHaveLength(1);
    });

    it('should handle updateMessageStatus', () => {
      const message: Message = {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: 'Test message',
        timestamp: new Date().toISOString(),
        status: 'sending',
      };

      const initialState: MessagesState = {
        messages: [message],
        loading: false,
        error: null,
      };

      const action = updateMessageStatus({ messageId: 1, status: 'sent' });
      const state = messagesReducer(initialState, action);

      expect(state.messages[0].status).toBe('sent');
    });
  });

  describe('async thunks', () => {
    it('should handle sendMessage.pending', () => {
      const action = { type: sendMessage.pending.type };
      const state = messagesReducer(undefined, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle sendMessage.fulfilled', () => {
      const newMessage: Message = {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: 'Test message',
        timestamp: new Date().toISOString(),
        status: 'sending',
      };

      const action = {
        type: sendMessage.fulfilled.type,
        payload: newMessage,
      };
      const state = messagesReducer(undefined, action);

      expect(state.loading).toBe(false);
      const addedMessage = state.messages.find((m) => m.id === newMessage.id);
      expect(addedMessage).toBeDefined();
    });

    it('should handle sendMessage.rejected', () => {
      const action = {
        type: sendMessage.rejected.type,
        error: { message: 'Failed to send' },
      };
      const state = messagesReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to send');
    });

    it('should dispatch sendMessage and update status over time', async () => {
      const messageInput: MessageInput = {
        senderId: 1,
        recipientId: 2,
        content: 'Test message',
      };

      const actionPromise = store.dispatch(sendMessage(messageInput));
      const result = await actionPromise;
      const sentMessage = result.payload as Message;

      // Initial status after fulfillment is 'sending'
      let state = store.getState().messages;
      expect(state.messages.find((m) => m.id === sentMessage.id)?.status).toBe(
        'sending'
      );

      // Advance to 'sent' status
      await vi.advanceTimersByTimeAsync(500);
      state = store.getState().messages;
      expect(state.messages.find((m) => m.id === sentMessage.id)?.status).toBe(
        'sent'
      );

      // Advance to 'delivered' status
      await vi.advanceTimersByTimeAsync(1000); // Total elapsed: 1500ms
      state = store.getState().messages;
      expect(state.messages.find((m) => m.id === sentMessage.id)?.status).toBe(
        'delivered'
      );

      // Advance to 'read' status
      await vi.advanceTimersByTimeAsync(2500); // Total elapsed: 4000ms
      state = store.getState().messages;
      expect(state.messages.find((m) => m.id === sentMessage.id)?.status).toBe(
        'read'
      );
    });

    it('should handle multiple messages with different statuses', async () => {
      const messageInput1: MessageInput = {
        senderId: 1,
        recipientId: 2,
        content: 'First message',
      };
      const messageInput2: MessageInput = {
        senderId: 1,
        recipientId: 2,
        content: 'Second message',
      };

      // Send first message
      const result1 = await store.dispatch(sendMessage(messageInput1));
      const message1 = result1.payload as Message;

      // Wait 1000ms
      await vi.advanceTimersByTimeAsync(1000);

      // Send second message
      const result2 = await store.dispatch(sendMessage(messageInput2));
      const message2 = result2.payload as Message;

      // At this point, message1 has been 'sending' for 1000ms. message2 just started.
      // Let's advance time by 500ms.
      // message1 total elapsed: 1500ms -> should be 'delivered'
      // message2 total elapsed: 500ms -> should be 'sent'
      await vi.advanceTimersByTimeAsync(500);

      const state = store.getState().messages;
      expect(state.messages.find((m) => m.id === message1.id)?.status).toBe(
        'delivered'
      );
      expect(state.messages.find((m) => m.id === message2.id)?.status).toBe(
        'sent'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle invalid message data gracefully', () => {
      const initialState: MessagesState = {
        messages: [],
        loading: false,
        error: null,
      };

      const invalidMessage = {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: '',
        timestamp: 'invalid-date',
      } as Message;

      const action = addMessage(invalidMessage);
      const state = messagesReducer(initialState, action);

      expect(state.messages).toHaveLength(1);
    });

    it('should handle updateMessageStatus for non-existent message', () => {
      const initialState: MessagesState = {
        messages: [],
        loading: false,
        error: null,
      };

      const action = updateMessageStatus({ messageId: 999, status: 'sent' });
      const state = messagesReducer(initialState, action);

      expect(state.messages).toHaveLength(0);
    });
  });
});
