import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChatState {
  typingUsers: number[];
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const initialState: ChatState = {
  typingUsers: [],
  isConnected: false,
  connectionStatus: 'disconnected',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnectionStatus: (
      state,
      action: PayloadAction<ChatState['connectionStatus']>
    ) => {
      state.connectionStatus = action.payload;
      state.isConnected = action.payload === 'connected';
    },
    addTypingUser: (state, action: PayloadAction<number>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action: PayloadAction<number>) => {
      state.typingUsers = state.typingUsers.filter(
        (id) => id !== action.payload
      );
    },
    clearTypingUsers: (state) => {
      state.typingUsers = [];
    },
  },
});

export const {
  setConnectionStatus,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
} = chatSlice.actions;
export default chatSlice.reducer;
