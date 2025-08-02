import { configureStore } from '@reduxjs/toolkit';
import messagesReducer, { type MessagesState } from '@/store/slices/messagesSlice';
import userReducer, { type UserState } from '@/store/slices/userSlice';
import pageReducer, { type PageState, type Route } from '@/store/slices/pageSlice';
import chatReducer, { type ChatState } from '@/store/slices/chatSlice';

export type MockStoreState = {
  messages?: Partial<MessagesState>;
  user?: Partial<UserState>;
  page?: Partial<PageState>;
  chat?: Partial<ChatState>;
};

export const createMockStore = (initialState?: MockStoreState) => {
  const defaultMessagesState: MessagesState = {
    messages: [],
    loading: false,
    error: null,
  };

  const defaultUserState: UserState = {
    currentUser: {
      id: 1,
      name: 'Test User',
      profile: 'https://example.com/test.jpg',
    },
    currentRecipient: null,
  };

  const defaultPageState: PageState = {
    currentPage: 'home' as Route,
  };

  const defaultChatState: ChatState = {
    typingUsers: [],
    isConnected: false,
    connectionStatus: 'disconnected',
  };

  return configureStore({
    reducer: {
      messages: messagesReducer,
      user: userReducer,
      page: pageReducer,
      chat: chatReducer,
    },
    preloadedState: {
      messages: {
        ...defaultMessagesState,
        ...initialState?.messages,
      },
      user: {
        ...defaultUserState,
        ...initialState?.user,
      },
      page: {
        ...defaultPageState,
        ...initialState?.page,
      },
      chat: {
        ...defaultChatState,
        ...initialState?.chat,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  });
};

export type MockStore = ReturnType<typeof createMockStore>;
