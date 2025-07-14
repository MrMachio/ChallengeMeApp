// Real backend integration for challenges API
import axios from 'axios';

// Configure axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define types for challenge creation
export interface CreateChallengeData {
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  imageUrl?: string
}

// Challenge API with real backend integration
export const challengesApi = {
  create: async (data: CreateChallengeData) => {
    const response = await api.post('/challenges', {
      ...data,
      difficulty: data.difficulty.toLowerCase()
    });
    return response.data;
  },

  getAll: async (filters?: {
    userConnectionType?: string,
    difficulty?: string,
    category?: string,
    sortType?: string
  }) => {
    const params = new URLSearchParams();
    if (filters?.userConnectionType) params.append('userConnectionType', filters.userConnectionType);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty.toLowerCase());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.sortType) params.append('sortType', filters.sortType);

    const response = await api.get('/challenges', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },

  // These endpoints are not yet implemented in backend, keeping stubs for now
  accept: async (challengeId: string, userId: string) => {
    // TODO: Implement when backend endpoint is ready
    return { success: true, message: 'Challenge accepted' };
  },

  submitProof: async (challengeId: string, userId: string, proofData: {
    proofUrl: string;
    description: string;
    proofType: 'image' | 'video';
  }) => {
    // TODO: Implement when backend endpoint is ready
    return { success: true, message: 'Proof submitted successfully' };
  },

  getStatus: async (challengeId: string, userId: string) => {
    // TODO: Implement when backend endpoint is ready
    return {
      status: 'none',
      proofUrl: null,
      proofDescription: null,
      submittedAt: null,
      completedAt: null
    };
  },

  getFavoriteStatus: async (challengeId: string) => {
    // TODO: Implement when backend endpoint is ready
    return { data: { isFavorite: false }, error: undefined };
  },

  toggleFavorite: async (challengeId: string) => {
    // TODO: Implement when backend endpoint is ready
    return { data: { isFavorite: true }, error: undefined };
  }
}; 