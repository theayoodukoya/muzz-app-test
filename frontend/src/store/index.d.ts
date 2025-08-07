export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    api: import("@reduxjs/toolkit/query").CombinedState<{
        getUsers: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "User" | "Message" | "Conversation", import("@/store/slices/userSlice").User[], "api", unknown>;
        getUser: import("@reduxjs/toolkit/query").QueryDefinition<number, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "User" | "Message" | "Conversation", import("@/store/slices/userSlice").User, "api", unknown>;
        sendMessage: import("@reduxjs/toolkit/query").MutationDefinition<{
            senderId: number;
            recipientId: number;
            content: string;
        }, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "User" | "Message" | "Conversation", import("@/store/slices/messagesSlice").Message, "api", unknown>;
    }, "User" | "Message" | "Conversation", "api">;
    messages: import("@/store/slices/messagesSlice").MessagesState;
    user: import("@/store/slices/userSlice").UserState;
    page: import("@/store/slices/pageSlice").PageState;
    chat: import("@/store/slices/chatSlice").ChatState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        api: import("@reduxjs/toolkit/query").CombinedState<{
            getUsers: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "User" | "Message" | "Conversation", import("@/store/slices/userSlice").User[], "api", unknown>;
            getUser: import("@reduxjs/toolkit/query").QueryDefinition<number, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "User" | "Message" | "Conversation", import("@/store/slices/userSlice").User, "api", unknown>;
            sendMessage: import("@reduxjs/toolkit/query").MutationDefinition<{
                senderId: number;
                recipientId: number;
                content: string;
            }, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "User" | "Message" | "Conversation", import("@/store/slices/messagesSlice").Message, "api", unknown>;
        }, "User" | "Message" | "Conversation", "api">;
        messages: import("@/store/slices/messagesSlice").MessagesState;
        user: import("@/store/slices/userSlice").UserState;
        page: import("@/store/slices/pageSlice").PageState;
        chat: import("@/store/slices/chatSlice").ChatState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
