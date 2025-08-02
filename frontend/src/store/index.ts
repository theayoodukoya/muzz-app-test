import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/store/slices/apiSlice';
import messagesReducer from '@/store/slices/messagesSlice';
import userReducer from '@/store/slices/userSlice';
import pageReducer from '@/store/slices/pageSlice';
import chatReducer from '@/store/slices/chatSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    messages: messagesReducer,
    user: userReducer,
    page: pageReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store as default for easier importing
export default store;
