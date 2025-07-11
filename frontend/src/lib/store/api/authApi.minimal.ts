import { apiSlice } from './apiSlice'
import { User } from '../../../lib/hooks/useAuth'

// Login and Registration interfaces
export interface LoginRequest {
  username: string // Changed from email to username
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AuthResponse {
  user: User
  token: {
    accessToken: string
    expiresAt: string
    refreshToken: string
    refreshExpiresAt: string
  }
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // User registration  
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Refresh token
    refreshToken: builder.mutation<{ accessToken: string; refreshToken: string; expiresAt: string; refreshExpiresAt: string }, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = authApi 