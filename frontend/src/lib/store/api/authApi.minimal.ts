import { apiSlice } from './apiSlice'

// Minimal auth types
export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  createdAt: string
  points: number
  activeChallenges: string[]
  pendingChallenges: string[]
  completedChallenges: string[]
  favoritesChallenges: string[]
  createdChallenges: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. User login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // 2. User registration  
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // 3. Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // 4. Get user by username (used in Profile page)
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/users/username/${username}`,
      providesTags: (result, error, username) => [{ type: 'User', id: username }],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetUserByUsernameQuery,
} = authApi 