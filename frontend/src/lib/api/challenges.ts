import { mockChallenges } from '../mock/data';

interface CreateChallengeData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  imageUrl: string;
  points: number;
}

// Имитация задержки запроса
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

export const challengesApi = {
  create: async (data: CreateChallengeData, userId: string) => {
    await simulateDelay();
    
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      ...data,
      creatorId: userId,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      completionsCount: 0,
      timeLimit: 168, // 7 days in hours by default
      creator: {
        username: 'You',
        avatarUrl: '/images/avatars/default.svg'
      }
    };

    // В реальном API здесь будет сохранение в базу данных
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
  }
}; 