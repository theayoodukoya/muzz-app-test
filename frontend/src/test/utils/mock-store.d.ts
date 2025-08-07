import { type MessagesState } from '@/store/slices/messagesSlice';
import { type UserState } from '@/store/slices/userSlice';
import { type PageState } from '@/store/slices/pageSlice';
import { type ChatState } from '@/store/slices/chatSlice';
export type MockStoreState = {
    messages?: Partial<MessagesState>;
    user?: Partial<UserState>;
    page?: Partial<PageState>;
    chat?: Partial<ChatState>;
};
export declare const createMockStore: (initialState?: MockStoreState) => import("@reduxjs/toolkit").EnhancedStore<{
    messages: MessagesState;
    user: UserState;
    page: PageState;
    chat: ChatState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        messages: MessagesState;
        user: UserState;
        page: PageState;
        chat: ChatState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type MockStore = ReturnType<typeof createMockStore>;
