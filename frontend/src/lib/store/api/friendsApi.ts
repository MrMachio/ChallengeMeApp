import { apiSlice } from './apiSlice'
import { User } from './authApi.minimal'

// Minimal friends types
export interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  sender: {
    id: string
    username: string
    avatarUrl?: string
  }
}

export interface FriendshipStatus {
  status: 'none' | 'friends' | 'pending' | 'received'
  requestId?: string
}

export const friendsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get friendship status (used in UserCard)
    getFriendshipStatus: builder.query<FriendshipStatus, { userId1: string; userId2: string }>({
      query: ({ userId1, userId2 }) => `/friends/status/${userId1}/${userId2}`,
      providesTags: (result, error, { userId1, userId2 }) => [
        { type: 'Friend', id: `${userId1}-${userId2}` }
      ],
    }),

    // 2. Send friend request (used in UserCard)
    sendFriendRequest: builder.mutation<{ success: boolean; message: string }, { 
      senderId: string
      receiverId: string 
    }>({
      query: ({ senderId, receiverId }) => ({
        url: '/friends/request',
        method: 'POST',
        body: { senderId, receiverId },
      }),
      invalidatesTags: ['Friend', 'FriendRequest'],
    }),

    // 3. Accept friend request (used in UserCard, Profile)
    acceptFriendRequest: builder.mutation<{ success: boolean; message: string }, {
      requestId: string
      userId: string
    }>({
      query: ({ requestId, userId }) => ({
        url: `/friends/request/${requestId}/accept`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Friend', 'FriendRequest'],
    }),

    // 4. Reject friend request (used in Profile)
    rejectFriendRequest: builder.mutation<{ success: boolean; message: string }, {
      requestId: string
      userId: string
    }>({
      query: ({ requestId, userId }) => ({
        url: `/friends/request/${requestId}/reject`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['FriendRequest'],
    }),

    // 5. Remove friend (used in Profile)
    removeFriend: builder.mutation<{ success: boolean; message: string }, {
      userId: string
      friendId: string
    }>({
      query: ({ userId, friendId }) => ({
        url: `/friends/${friendId}`,
        method: 'DELETE',
        body: { userId },
      }),
      invalidatesTags: ['Friend'],
    }),

    // 6. Get friends (used in Users page, Profile)
    getFriends: builder.query<User[], string>({
      query: (userId) => `/users/${userId}/friends`,
      providesTags: ['Friend'],
    }),

    // 7. Get pending requests (used in Users page, Profile)
    getPendingRequests: builder.query<{ sent: FriendRequest[]; received: FriendRequest[] }, string>({
      query: (userId) => `/users/${userId}/friend-requests`,
      providesTags: ['FriendRequest'],
    }),
  }),
})

export const {
  useGetFriendshipStatusQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
} = friendsApi 