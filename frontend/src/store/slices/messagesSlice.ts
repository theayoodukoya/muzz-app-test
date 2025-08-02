import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: string;
  status?: MessageStatus;
}

export interface MessageInput {
  senderId: number;
  recipientId: number;
  content: string;
}

export interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

// Sample messages for demo with status
const sampleMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    recipientId: 2,
    content: 'Hey John! How are you doing?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'read',
  },
  {
    id: 2,
    senderId: 2,
    recipientId: 1,
    content: "Hi Alisha! I'm doing great, thanks for asking!",
    timestamp: new Date(
      Date.now() - 2 * 60 * 60 * 1000 + 10 * 1000
    ).toISOString(),
  },
  {
    id: 3,
    senderId: 2,
    recipientId: 1,
    content: 'How about you?',
    timestamp: new Date(
      Date.now() - 2 * 60 * 60 * 1000 + 15 * 1000
    ).toISOString(),
  },
  {
    id: 4,
    senderId: 1,
    recipientId: 2,
    content: "I'm doing well too! Just working on some projects.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'delivered',
  },
  {
    id: 5,
    senderId: 1,
    recipientId: 3,
    content: 'Hi Maddie! Want to grab coffee later?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'read',
  },
  {
    id: 6,
    senderId: 3,
    recipientId: 1,
    content: 'That sounds great! What time works for you?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

const initialState: MessagesState = {
  messages: sampleMessages,
  loading: false,
  error: null,
};

// Async thunk for sending messages
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageInput: MessageInput, { dispatch }) => {
    // Create message with initial sending status
    const newMessage: Message = {
      id: Date.now(),
      senderId: messageInput.senderId,
      recipientId: messageInput.recipientId,
      content: messageInput.content,
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    // Simulate status progression
    setTimeout(() => {
      dispatch(
        updateMessageStatus({ messageId: newMessage.id, status: 'sent' })
      );
    }, 500);

    setTimeout(() => {
      dispatch(
        updateMessageStatus({ messageId: newMessage.id, status: 'delivered' })
      );
    }, 1500);

    setTimeout(() => {
      dispatch(
        updateMessageStatus({ messageId: newMessage.id, status: 'read' })
      );
    }, 4000);

    return newMessage;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      // Check for duplicates
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

      if (!messageExists) {
        // Set default status for received messages (no status for incoming messages)
        if (message.senderId !== message.recipientId && !message.status) {
          // Don't set status for received messages
        }
        state.messages.push(message);
        console.log('Added message to Redux store:', message);
      } else {
        console.log('Message already exists, skipping:', message.id);
      }
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: number; status: MessageStatus }>
    ) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        message.status = status;
        console.log(`Updated message ${messageId} status to ${status}`);
      }
    },
    markMessagesAsRead: (
      state,
      action: PayloadAction<{ senderId: number; recipientId: number }>
    ) => {
      const { senderId, recipientId } = action.payload;
      state.messages.forEach((message) => {
        if (
          message.senderId === senderId &&
          message.recipientId === recipientId &&
          message.status !== 'read'
        ) {
          message.status = 'read';
        }
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const newMessage = action.payload;

        // Add message to store
        state.messages.push(newMessage);
        console.log('Message sent successfully:', action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const {
  addMessage,
  updateMessageStatus,
  markMessagesAsRead,
  clearMessages,
  setError,
  clearError,
} = messagesSlice.actions;
export default messagesSlice.reducer;
