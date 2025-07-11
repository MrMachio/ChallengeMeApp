// Temporary mock challenges API - will be replaced with real backend integration
import { mockChallenges } from '../mock/data'

// Define types for challenge creation
export interface CreateChallengeData {
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  imageUrl?: string
}

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

// Get current user stub - will be replaced with real auth
const getCurrentUser = () => {
  // TODO: Get current user from useAuth context
  return null;
};

// Challenge API
export const challengesApi = {
  create: async (data: CreateChallengeData, userId: string) => {
    await simulateDelay();
    
    // TODO: Replace with real API call
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      ...data,
      imageUrl: data.imageUrl || '/images/challenges/default.jpg',
      creatorId: userId,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      completionsCount: 0,
      timeLimit: 168, // 7 days in hours by default
      creator: {
        username: 'Unknown User', // Will be set by backend
        avatarUrl: '/images/avatars/default.svg'
      }
    };

    // In real implementation, this will be saved to backend
    mockChallenges.push(newChallenge);
    
    return newChallenge;
  },

  getAll: async () => {
    await simulateDelay();
    return mockChallenges;
  },

  getById: async (id: string) => {
    await simulateDelay();
    return mockChallenges.find(challenge => challenge.id === id);
  },

  // Accept challenge
  accept: async (challengeId: string, userId: string) => {
    await simulateDelay();
    // TODO: Replace with real API call to backend
    return { success: true, message: 'Challenge accepted' };
  },

  // Submit proof for challenge
  submitProof: async (challengeId: string, userId: string, proofData: {
    proofUrl: string;
    description: string;
    proofType: 'image' | 'video';
  }) => {
    await simulateDelay();
    // TODO: Replace with real API call to backend
    return { success: true, message: 'Proof submitted successfully' };
  },

  // Get challenge status for user
  getStatus: async (challengeId: string, userId: string) => {
    await simulateDelay();
    // TODO: Replace with real API call to backend
    return {
      status: 'none', // 'none' | 'active' | 'pending' | 'completed'
      proofUrl: null,
      proofDescription: null,
      submittedAt: null,
      completedAt: null
    };
  },

  // Get favorite status for challenge
  getFavoriteStatus: async (challengeId: string) => {
    await simulateDelay();
    // TODO: Replace with real API call to backend
    return { data: { isFavorite: false }, error: undefined };
  },

  // Toggle favorite status
  toggleFavorite: async (challengeId: string) => {
    await simulateDelay();
    // TODO: Replace with real API call to backend
    return { data: { isFavorite: true }, error: undefined };
  }
}; 