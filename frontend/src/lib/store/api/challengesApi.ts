import { apiSlice } from './apiSlice'

// Minimal types for challenges (only what's actually used)
export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  imageUrl: string
  points: number
  creatorId: string
  createdAt: string
  likesCount: number
  completionsCount: number
  creator: {
    username: string
    avatarUrl: string
  }
}

export interface CreateChallengeRequest {
  title: string
  description: string
  category: string
  difficulty: string
  imageUrl: string
  points: number
}

export interface ChallengeStatus {
  status: 'none' | 'active' | 'pending' | 'completed'
  proofUrl?: string
  proofDescription?: string
  submittedAt?: string
  completedAt?: string
}

export interface ProofSubmission {
  proofUrl?: string
  description?: string
  proofType?: 'image' | 'video'
}

export const challengesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Create new challenge (used in CreateChallengeModal)
    createChallenge: builder.mutation<Challenge, CreateChallengeRequest>({
      query: (challenge) => ({
        url: '/challenges',
        method: 'POST',
        body: challenge,
      }),
      invalidatesTags: ['Challenge'],
    }),

    // 2. Get challenge status (used in useChallengeStatus hook)
    getChallengeStatus: builder.query<ChallengeStatus, string>({
      query: (challengeId) => `/challenges/${challengeId}/status`,
      providesTags: (result, error, challengeId) => [
        { type: 'Challenge', id: challengeId }
      ],
    }),

    // 3. Update challenge status (used in useChallengeStatus hook)
    updateChallengeStatus: builder.mutation<void, { 
      challengeId: string
      action: 'accept' | 'submit_proof' | 'approve' | 'reject'
      proofData?: ProofSubmission
    }>({
      query: ({ challengeId, action, proofData }) => ({
        url: `/challenges/${challengeId}/status`,
        method: 'PUT',
        body: { action, proofData },
      }),
      invalidatesTags: (result, error, { challengeId }) => [
        { type: 'Challenge', id: challengeId }
      ],
    }),

    // 4. Toggle favorite (used in ChallengeModal, ChallengeCard)
    toggleFavorite: builder.mutation<{ isFavorite: boolean }, string>({
      query: (challengeId) => ({
        url: `/challenges/${challengeId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, challengeId) => [
        { type: 'Challenge', id: challengeId }
      ],
    }),

    // 5. Get favorite status (used in ChallengeModal)
    getFavoriteStatus: builder.query<{ isFavorite: boolean }, string>({
      query: (challengeId) => `/challenges/${challengeId}/favorite-status`,
      providesTags: (result, error, challengeId) => [
        { type: 'Challenge', id: challengeId }
      ],
    }),

    // 6. Get favorites (probably used somewhere)
    getFavorites: builder.query<Challenge[], void>({
      query: () => '/challenges/favorites',
      providesTags: ['Challenge'],
    }),
  }),
})

export const {
  useCreateChallengeMutation,
  useGetChallengeStatusQuery,
  useUpdateChallengeStatusMutation,
  useToggleFavoriteMutation,
  useGetFavoriteStatusQuery,
  useGetFavoritesQuery,
} = challengesApi 