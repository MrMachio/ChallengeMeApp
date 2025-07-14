import { apiSlice } from './apiSlice'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { Challenge, CreateChallengeRequest } from '@/lib/types/api.types'
import { addFavoriteToStorage, removeFavoriteFromStorage, isFavoriteInStorage } from '@/lib/utils/favorites'

export interface ChallengeFilters {
  userConnectionType?: string
  difficulty?: string
  category?: string
  sortType?: string
}

// Error handling helper
const handleError = (error: FetchBaseQueryError | undefined) => {
  if (error) {
    if ('status' in error) {
      if (error.status === 401) {
        // Handle unauthorized error
        const storage = typeof window !== 'undefined' ? window.localStorage : null
        storage?.removeItem('accessToken')
        storage?.removeItem('refreshToken')
        window.location.href = '/login'
      }
      // Log other errors
      console.error('API Error:', error)
    }
  }
}

export const challengesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all challenges with filters
    getChallenges: builder.query<Challenge[], ChallengeFilters>({
      query: (filters) => ({
        url: '/challenges',
        method: 'GET',
        params: {
          userConnectionType: filters?.userConnectionType || 'saved',
          difficulty: filters?.difficulty?.toLowerCase(),
          category: filters?.category,
          sortType: filters?.sortType
        }
      }),
      transformErrorResponse: (error) => {
        handleError(error)
        return error
      },
      providesTags: ['Challenge']
    }),

    // Get single challenge by ID
    getChallenge: builder.query<Challenge, string>({
      query: (id) => `/challenges/${id}`,
      transformErrorResponse: (error) => {
        handleError(error)
        return error
      },
      providesTags: (result, error, id) => [{ type: 'Challenge', id }]
    }),

    // Create new challenge
    createChallenge: builder.mutation<Challenge, CreateChallengeRequest>({
      query: (challenge) => ({
        url: '/challenges',
        method: 'POST',
        body: challenge
      }),
      transformErrorResponse: (error) => {
        handleError(error)
        return error
      },
      invalidatesTags: ['Challenge']
    }),

    // Save challenge to favorites
    saveChallenge: builder.mutation<void, string>({
      query: (challengeId) => ({
        url: `/challenges/${challengeId}/save`,
        method: 'PATCH'
      }),
      transformErrorResponse: (error) => {
        handleError(error)
        return error
      },
      async onQueryStarted(challengeId, { dispatch, queryFulfilled }) {
        // Update localStorage immediately
        addFavoriteToStorage(challengeId);

        // Get the current challenges list
        const savedChallenges = dispatch(
          challengesApi.util.updateQueryData('getChallenges', { userConnectionType: 'saved' }, (draft) => {
            if (!draft.find(c => c.id === challengeId)) {
              // Add the challenge to saved list if not already there
              const challenge = draft.find(c => c.id === challengeId)
              if (challenge) {
                draft.push(challenge)
              }
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          // If the mutation fails, revert the optimistic update
          savedChallenges.undo()
          // Also revert localStorage
          removeFavoriteFromStorage(challengeId);
        }
      }
    }),

    // Remove challenge from favorites
    unsaveChallenge: builder.mutation<void, string>({
      query: (challengeId) => ({
        url: `/challenges/${challengeId}/unsave`,
        method: 'PATCH'
      }),
      transformErrorResponse: (error) => {
        handleError(error)
        return error
      },
      async onQueryStarted(challengeId, { dispatch, queryFulfilled }) {
        // Update localStorage immediately
        removeFavoriteFromStorage(challengeId);

        // Get the current challenges list
        const savedChallenges = dispatch(
          challengesApi.util.updateQueryData('getChallenges', { userConnectionType: 'saved' }, (draft) => {
            const index = draft.findIndex(c => c.id === challengeId)
            if (index !== -1) {
              draft.splice(index, 1)
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          // If the mutation fails, revert the optimistic update
          savedChallenges.undo()
          // Also revert localStorage
          addFavoriteToStorage(challengeId);
        }
      }
    }),

    // Get favorite status
    getFavoriteStatus: builder.query<boolean, string>({
      queryFn: async (challengeId, { getState }) => {
        try {
          // First check localStorage
          const isInLocalStorage = isFavoriteInStorage(challengeId);
          if (isInLocalStorage) {
            return { data: true };
          }

          // If not in localStorage, check the API state
          const state = getState() as any;
          const savedChallenges = state.api?.queries?.['getChallenges({"userConnectionType":"saved"}']?.data;
          if (savedChallenges) {
            const isSaved = savedChallenges.some((c: Challenge) => c.id === challengeId);
            // Update localStorage if found in API state
            if (isSaved) {
              addFavoriteToStorage(challengeId);
            }
            return { data: isSaved };
          }
          return { data: false };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Failed to get favorite status' } };
        }
      },
      providesTags: (result, error, challengeId) => [{ type: 'Challenge', id: challengeId }]
    })
  })
})

export const {
  useGetChallengesQuery,
  useGetChallengeQuery,
  useCreateChallengeMutation,
  useSaveChallengeMutation,
  useUnsaveChallengeMutation,
  useGetFavoriteStatusQuery
} = challengesApi 