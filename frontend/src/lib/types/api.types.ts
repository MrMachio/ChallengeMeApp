// Central API types exports for minimal RTK Query setup
// This file provides a single import point for all API-related types

// Import User type from useAuth hook
import type { User } from '../hooks/useAuth'

// Re-export User type and other auth types
export type { User }
export type { LoginRequest, RegisterRequest, AuthResponse } from '../store/api/authApi.minimal'
export type { FriendRequest, FriendshipStatus } from '../store/api/friendsApi'
export type { Message, Chat } from '../store/api/chatApi'

// Challenge related types
export interface CreateChallengeRequest {
  title: string
  description: string
  coverImageUrl?: string | null
  points: number
  category: string
  difficulty: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  timeLimit: number | null
  imageUrl: string | null
  likesCount: number
  completionsCount: number
  creatorId: string
  creator: {
    username: string
    avatarUrl: string
  }
  createdAt: string
}

export interface ChallengeStatus {
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  startedAt?: string
  completedAt?: string
  proof?: ProofSubmission
}

export interface ProofSubmission {
  text?: string
  imageUrls?: string[]
  videoUrl?: string
  submittedAt: string
}

// User stats types
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