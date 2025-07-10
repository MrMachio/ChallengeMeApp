import { apiSlice } from './apiSlice'

// Minimal chat types
export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'challenge'
  challengeId?: string
  timestamp: string
  isRead: boolean
}

export interface Chat {
  id: string
  participants: string[]
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
}

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get or create chat (used in ChatWindow, Users page)
    getOrCreateChat: builder.mutation<Chat, { userId1: string; userId2: string }>({
      query: ({ userId1, userId2 }) => ({
        url: '/chats/direct',
        method: 'POST',
        body: { userId1, userId2 },
      }),
      invalidatesTags: ['Chat'],
    }),

    // 2. Send message (used in ChatWindow)
    sendMessage: builder.mutation<Message, {
      chatId: string
      senderId: string
      content: string
      type?: 'text' | 'challenge'
      challengeId?: string
    }>({
      query: ({ chatId, ...messageData }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Chat', id: chatId },
        'Chat'
      ],
    }),

    // 3. Mark messages as read (used in Users page)
    markMessagesAsRead: builder.mutation<{ success: boolean }, {
      chatId: string
      userId: string
    }>({
      query: ({ chatId, userId }) => ({
        url: `/chats/${chatId}/read`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Chat', id: chatId }
      ],
    }),
  }),
})

export const {
  useGetOrCreateChatMutation,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} = chatApi 