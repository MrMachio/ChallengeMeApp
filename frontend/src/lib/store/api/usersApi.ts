import { apiSlice } from './apiSlice'
import { User } from './authApi.minimal'

export interface PaginatedUsers {
  users: User[]
  total: number
  page: number
  totalPages: number
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get all users (used in Users page)
    getAllUsers: builder.query<PaginatedUsers, { 
      page?: number
      limit?: number
      search?: string 
    }>({
      query: ({ page = 1, limit = 20, search } = {}) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('limit', String(limit))
        if (search) params.append('search', search)
        return `/users?${params.toString()}`
      },
      providesTags: ['User'],
    }),
  }),
})

export const {
  useGetAllUsersQuery,
} = usersApi 