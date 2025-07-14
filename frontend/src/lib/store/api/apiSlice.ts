import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our base API URL (you can change this to your backend URL)
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'

// Safe localStorage access
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage
  }
  return null
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Add authorization header if token exists
      const storage = getLocalStorage()
      const token = storage?.getItem('accessToken')
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