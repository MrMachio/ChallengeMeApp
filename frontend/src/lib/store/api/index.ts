// Main API exports - Minimal RTK Query setup (23 endpoints total)

// Export all API slices
export { challengesApi } from './challengesApi'
export { authApi } from './authApi.minimal'
export { usersApi } from './usersApi'
export { friendsApi } from './friendsApi'
export { chatApi } from './chatApi'
export { notificationsApi } from './notificationsApi'
export { imagesApi } from './imagesApi.minimal'

// Export all hooks for easy importing
// Challenges API (6 endpoints)
export {
  useCreateChallengeMutation,
  useGetChallengeStatusQuery,
  useUpdateChallengeStatusMutation,
  useToggleFavoriteMutation,
  useGetFavoriteStatusQuery,
  useGetFavoritesQuery,
} from './challengesApi'

// Auth API (4 endpoints)
export {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetUserByUsernameQuery,
} from './authApi.minimal'

// Users API (1 endpoint)
export {
  useGetAllUsersQuery,
} from './usersApi'

// Friends API (7 endpoints)
export {
  useGetFriendshipStatusQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
} from './friendsApi'

// Chat API (3 endpoints)
export {
  useGetOrCreateChatMutation,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} from './chatApi'

// Notifications API (1 endpoint)
export {
  useGetUnreadCountQuery,
} from './notificationsApi'

// Images API (1 endpoint)
export {
  useUploadImageMutation,
} from './imagesApi.minimal'

// Export types
export type { Challenge, CreateChallengeRequest, ChallengeStatus, ProofSubmission } from './challengesApi'
export type { User, LoginRequest, RegisterRequest, LoginResponse } from './authApi.minimal'
export type { PaginatedUsers } from './usersApi'
export type { FriendRequest, FriendshipStatus } from './friendsApi'
export type { Message, Chat } from './chatApi' 