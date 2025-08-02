import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChatState {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const initialState: ChatState = {
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
      console.log(`[Redux] Connection status updated:`, {
        status: action.payload,
        isConnected: state.isConnected,
      });
    },
  },
});

export const { setConnectionStatus } = chatSlice.actions;
export default chatSlice.reducer;
