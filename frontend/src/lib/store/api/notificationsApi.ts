import { apiSlice } from './apiSlice'

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get unread count (used in Users page)
    getUnreadCount: builder.query<{ count: number }, string>({
      query: (userId) => `/notifications/${userId}/unread-count`,
      providesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetUnreadCountQuery,
} = notificationsApi 