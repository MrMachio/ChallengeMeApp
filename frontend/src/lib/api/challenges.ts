import { mockChallenges, mockUsers, mockCompletions } from '../mock/data';

interface CreateChallengeData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  imageUrl: string;
  points: number;
}

export interface ChallengeStatus {
  status: 'none' | 'active' | 'pending' | 'completed';
  proofUrl?: string;
  proofDescription?: string;
  submittedAt?: string;
  completedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Имитация задержки запроса
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

// Получение текущего пользователя из mock данных по ID из localStorage
const getCurrentUser = () => {
  try {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId && mockUsers[currentUserId]) {
      return mockUsers[currentUserId];
    }
  } catch (error) {
    console.error('Error loading user ID from localStorage:', error);
  }
  // Возвращаем null если пользователь не найден
  return null;
};

// Сохранение изменений пользователя в mock данных и отправка события обновления
const saveUserChanges = (userId: string) => {
  try {
    // Отправляем событие для обновления UI
    window.dispatchEvent(new Event('userUpdated'));
  } catch (error) {
    console.error('Error saving user changes:', error);
  }
};

export const challengesApi = {
  create: async (data: CreateChallengeData, userId: string) => {
    await simulateDelay();
    
    // Получаем данные пользователя из mockUsers
    const user = mockUsers[userId];
    if (!user) {
      throw new Error('User not found');
    }
    
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      ...data,
      creatorId: userId,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      completionsCount: 0,
      timeLimit: 168, // 7 days in hours by default
      creator: {
        username: user.username,
        avatarUrl: user.avatarUrl || '/images/avatars/default.svg'
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
  },

  // Получение статуса задания для текущего пользователя
  getChallengeStatus: async (challengeId: string): Promise<ApiResponse<ChallengeStatus>> => {
    await simulateDelay();
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        return {
          data: { status: 'none' },
          error: 'User not found'
        };
      }
      
      // Проверяем статус задания
      const completion = mockCompletions[challengeId]?.find(
        c => c.userId === currentUser.id
      );
      
      let status: ChallengeStatus['status'] = 'none';
      
      if (currentUser.completedChallenges.includes(challengeId)) {
        status = 'completed';
      } else if (currentUser.pendingChallenges.includes(challengeId)) {
        status = 'pending';
      } else if (currentUser.activeChallenges.includes(challengeId)) {
        status = 'active';
      }
      
      return {
        data: {
          status,
          proofUrl: completion?.proofUrl,
          proofDescription: completion?.description,
          submittedAt: completion?.submittedAt,
          completedAt: completion?.completedAt
        }
      };
    } catch (error) {
      return {
        data: { status: 'none' },
        error: 'Failed to get challenge status'
      };
    }
  },

  // Обновление статуса задания
  updateChallengeStatus: async (
    challengeId: string,
    action: 'accept' | 'submit_proof' | 'approve' | 'reject',
    proofData?: { proofUrl?: string; description?: string; proofType?: 'image' | 'video' }
  ): Promise<ApiResponse<void>> => {
    await simulateDelay();
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        return {
          data: undefined,
          error: 'User not found'
        };
      }
      
      switch (action) {
        case 'accept':
          // Добавляем задание в активные
          if (!currentUser.activeChallenges.includes(challengeId)) {
            currentUser.activeChallenges.push(challengeId);
          }
          break;
        
        case 'submit_proof':
          // Перемещаем из активных в ожидающие подтверждения
          currentUser.activeChallenges = currentUser.activeChallenges.filter((id: string) => id !== challengeId);
          if (!currentUser.pendingChallenges.includes(challengeId)) {
            currentUser.pendingChallenges.push(challengeId);
          }
          
          // Добавляем completion с доказательством
          if (proofData) {
            const newCompletion = {
              id: `comp${Date.now()}`,
              userId: currentUser.id,
              username: currentUser.username,
              avatarUrl: currentUser.avatarUrl,
              rating: 0,
              userRatings: {},
              likes: 0,
              dislikes: 0,
              proofUrl: proofData.proofUrl || '',
              proofType: proofData.proofType || 'image',
              description: proofData.description || '',
              status: 'pending' as const,
              submittedAt: new Date().toISOString(),
              completedAt: new Date().toISOString()
            };
            
            if (!mockCompletions[challengeId]) {
              mockCompletions[challengeId] = [];
            }
            mockCompletions[challengeId].push(newCompletion);
          }
          break;
        
        case 'approve':
          // Перемещаем из ожидающих в завершенные
          currentUser.pendingChallenges = currentUser.pendingChallenges.filter((id: string) => id !== challengeId);
          if (!currentUser.completedChallenges.includes(challengeId)) {
            currentUser.completedChallenges.push(challengeId);
          }
          
          // Добавляем очки за выполнение
          const challenge = mockChallenges.find(c => c.id === challengeId);
          if (challenge) {
            currentUser.points += challenge.points || 0;
          }
          
          // Обновляем статус completion
          const completion = mockCompletions[challengeId]?.find(c => c.userId === currentUser.id);
          if (completion) {
            completion.status = 'approved';
            completion.completedAt = new Date().toISOString();
          }
          break;
        
        case 'reject':
          // Перемещаем из ожидающих обратно в активные
          currentUser.pendingChallenges = currentUser.pendingChallenges.filter((id: string) => id !== challengeId);
          if (!currentUser.activeChallenges.includes(challengeId)) {
            currentUser.activeChallenges.push(challengeId);
          }
          
          // Обновляем статус completion
          const rejectedCompletion = mockCompletions[challengeId]?.find(c => c.userId === currentUser.id);
          if (rejectedCompletion) {
            rejectedCompletion.status = 'rejected';
          }
          break;
      }
      
      // Сохраняем изменения и уведомляем о обновлении
      saveUserChanges(currentUser.id);
      
      return {
        data: undefined
      };
    } catch (error) {
      return {
        data: undefined,
        error: 'Failed to update challenge status'
      };
    }
  },

  // Добавление/удаление задания в/из избранного
  toggleFavorite: async (challengeId: string): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    await simulateDelay();
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        return {
          data: { isFavorite: false },
          error: 'User not found'
        };
      }
      
      const isFavorite = currentUser.favoritesChallenges.includes(challengeId);
      
      if (isFavorite) {
        // Удаляем из избранных
        currentUser.favoritesChallenges = currentUser.favoritesChallenges.filter((id: string) => id !== challengeId);
      } else {
        // Добавляем в избранные
        currentUser.favoritesChallenges.push(challengeId);
      }
      
      // Сохраняем изменения и уведомляем о обновлении
      saveUserChanges(currentUser.id);
      
      return {
        data: { isFavorite: !isFavorite }
      };
    } catch (error) {
      return {
        data: { isFavorite: false },
        error: 'Failed to toggle favorite'
      };
    }
  },

  // Получение статуса избранного для задания
  getFavoriteStatus: async (challengeId: string): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    await simulateDelay();
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        return {
          data: { isFavorite: false },
          error: 'User not found'
        };
      }
      
      const isFavorite = currentUser.favoritesChallenges.includes(challengeId);
      
      return {
        data: { isFavorite }
      };
    } catch (error) {
      return {
        data: { isFavorite: false },
        error: 'Failed to get favorite status'
      };
    }
  },

  // Получение всех избранных заданий
  getFavorites: async (): Promise<ApiResponse<typeof mockChallenges>> => {
    await simulateDelay();
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        return {
          data: [],
          error: 'User not found'
        };
      }
      
      const favoritesChallenges = mockChallenges.filter(challenge => 
        currentUser.favoritesChallenges.includes(challenge.id)
      );
      
      return {
        data: favoritesChallenges
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to get favorites'
      };
    }
  }
}; 