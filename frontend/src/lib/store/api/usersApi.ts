import { apiSlice } from './apiSlice'
import { User } from '../../../lib/hooks/useAuth'

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  totalPages: number
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and search
    getUsers: builder.query<UserListResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 20, search = '' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search })
        })
        return `/users?${params}`
      },
      providesTags: ['User'],
    }),

    // Get user by username (for profile page)
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/users/username/${username}`,
      providesTags: (result, error, username) => [{ type: 'User', id: username }],
    }),

    // Get current user (/auth/me)
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Update current user profile
    updateCurrentUser: builder.mutation<User, Partial<Pick<User, 'fullName' | 'avatarUrl'>>>({
      query: (updateData) => ({
        url: '/users/me',
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByUsernameQuery,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} = usersApi 