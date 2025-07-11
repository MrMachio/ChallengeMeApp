import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our base API URL (you can change this to your backend URL)
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Add authorization header if token exists
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: [
    'Challenge',
    'User', 
    'UserProfile',
    'Friend',
    'FriendRequest',
    'Chat',
    'Message',
    'Notification',
    'Completion',
    'Category'
  ],
  endpoints: () => ({}),
})

export default apiSlice 