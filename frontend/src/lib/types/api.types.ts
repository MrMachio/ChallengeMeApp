// Central API types exports for minimal RTK Query setup
// This file provides a single import point for all API-related types

// Re-export all types from minimal API modules
export type { Challenge, CreateChallengeRequest, ChallengeStatus, ProofSubmission } from '../store/api/challengesApi'
export type { User, LoginRequest, RegisterRequest, LoginResponse } from '../store/api/authApi.minimal'
export type { PaginatedUsers } from '../store/api/usersApi'
export type { FriendRequest, FriendshipStatus } from '../store/api/friendsApi'
export type { Message, Chat } from '../store/api/chatApi'

// Legacy compatibility - these types might be used by existing components
export interface UserStats {
  totalChallenges: number
  completedChallenges: number
  activeChallenges: number
  pendingChallenges: number
  createdChallenges: number
  favoritesChallenges: number
  friends: number
  totalPoints: number
  currentStreak: number
  maxStreak: number
  joinedAt: string
  lastActiveAt: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  iconUrl: string
  unlockedAt: string
  category: string
}

// Basic notification type (for components that might use it)
export interface Notification {
  id: string
  userId: string
  type: 'friend_request' | 'friend_accepted' | 'message' | 'challenge_shared' | 'challenge_completed' | 'system'
  title: string
  content: string
  isRead: boolean
  createdAt: string
  fromUserId?: string
  fromUser?: {
    id: string
    username: string
    avatarUrl?: string
  }
  data?: {
    requestId?: string
    challengeId?: string
    chatId?: string
    [key: string]: any
  }
  actionUrl?: string
} 