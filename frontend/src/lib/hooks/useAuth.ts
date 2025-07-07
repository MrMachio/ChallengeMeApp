import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { mockCurrentUser, mockUsers } from '../mock/data'

export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  points: number
  completedChallenges: string[]
  activeChallenges: string[]
  createdChallenges: string[]
  pendingChallenges: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Получение пользователя по ID из mock данных
  const getUserById = (userId: string): User | null => {
    const mockUser = mockUsers[userId]
    if (mockUser) {
      return {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        fullName: mockUser.fullName,
        avatarUrl: mockUser.avatarUrl,
        points: mockUser.points,
        completedChallenges: mockUser.completedChallenges,
        activeChallenges: mockUser.activeChallenges,
        createdChallenges: mockUser.createdChallenges,
        pendingChallenges: mockUser.pendingChallenges
      }
    }
    return null
  }

  useEffect(() => {
    // Проверяем наличие ID пользователя в localStorage
    const loadUser = () => {
      try {
        const savedUserId = localStorage.getItem('currentUserId')
        if (savedUserId) {
          // Получаем актуальные данные из mock данных
          const currentUser = getUserById(savedUserId)
          if (currentUser) {
            setUser(currentUser)
          } else {
            // Если пользователь не найден в mock данных, очищаем localStorage
            localStorage.removeItem('currentUserId')
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        // Очищаем некорректные данные
        localStorage.removeItem('currentUserId')
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Слушаем изменения localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUserId') {
        loadUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Слушаем изменения mock данных в том же окне
    const handleMockDataUpdate = () => {
      loadUser()
    }

    window.addEventListener('userUpdated', handleMockDataUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userUpdated', handleMockDataUpdate)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    // Имитируем задержку запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Используем данные из mock (по умолчанию user1)
    const testUserId = 'user1'
    const testUser = getUserById(testUserId)
    
    if (testUser) {
      setUser(testUser)
      // Сохраняем только ID пользователя в localStorage
      localStorage.setItem('currentUserId', testUserId)
      // Отправляем событие для обновления UI
      window.dispatchEvent(new Event('userUpdated'))
      
      // Небольшая задержка для обеспечения обновления состояния
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Перенаправляем на главную страницу
      router.push('/')
    }
  }, [router])

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    // Имитируем задержку запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Создаем ID для нового пользователя
    const newUserId = `user${Date.now()}`
    
    // Создаем нового пользователя в mock данных
    const newMockUser = {
      id: newUserId,
      email,
      username,
      fullName: username,
      avatarUrl: '/images/avatars/default.svg',
      points: 0,
      completedChallenges: [],
      activeChallenges: [],
      createdChallenges: [],
      pendingChallenges: [],
      followers: 0,
      following: 0
    }
    
    // Добавляем пользователя в mock данные
    mockUsers[newUserId] = newMockUser
    
    const newUser = getUserById(newUserId)
    if (newUser) {
      setUser(newUser)
      // Сохраняем только ID пользователя в localStorage
      localStorage.setItem('currentUserId', newUserId)
      // Отправляем событие для обновления UI
      window.dispatchEvent(new Event('userUpdated'))
      
      // Небольшая задержка для обеспечения обновления состояния
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Перенаправляем на главную страницу
      router.push('/')
    }
  }, [router])

  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('currentUserId')
    // Отправляем событие для обновления UI
    window.dispatchEvent(new Event('userUpdated'))
    router.push('/login')
  }, [router])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
} 