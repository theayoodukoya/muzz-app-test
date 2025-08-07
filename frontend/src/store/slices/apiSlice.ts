import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '@/store/slices/userSlice';
import type { Message } from '@/store/slices/messagesSlice';

// Define API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['User', 'Message', 'Conversation'],
  endpoints: (builder) => ({
    // Users endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/user/all.json',
      providesTags: ['User'],
    }),
    getUser: builder.query<User, number>({
      query: (id) => `/user/${id}.json`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Messages endpoints - removed non-existent endpoints
    sendMessage: builder.mutation<
      Message,
      {
        senderId: number;
        recipientId: number;
        content: string;
      }
    >({
      queryFn: async (messageData) => {
        // Since we don't have a real backend, just return the message with generated ID
        const newMessage: Message = {
          id: Date.now(),
          senderId: messageData.senderId,
          recipientId: messageData.recipientId,
          content: messageData.content,
          timestamp: new Date().toISOString(),
        };
        return { data: newMessage };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetUsersQuery, useGetUserQuery, useSendMessageMutation } =
  apiSlice;
