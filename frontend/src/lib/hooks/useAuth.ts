import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { mockCurrentUser } from '../mock/data'

// Тестовый пользователь
const TEST_USER = {
  id: mockCurrentUser.id,
  email: mockCurrentUser.email,
  username: mockCurrentUser.username,
  avatarUrl: mockCurrentUser.avatarUrl,
  points: mockCurrentUser.points,
  completedChallenges: mockCurrentUser.completedChallenges,
  activeChallenges: mockCurrentUser.activeChallenges,
  createdChallenges: mockCurrentUser.createdChallenges
}

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
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Проверяем наличие пользователя в localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    // Имитируем задержку запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Всегда возвращаем тестового пользователя
    setUser(TEST_USER)
    localStorage.setItem('user', JSON.stringify(TEST_USER))
    router.push('/')
  }, [router])

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    // Имитируем задержку запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Создаем нового пользователя
    const newUser = {
      id: `user${Date.now()}`,
      email,
      username,
      avatarUrl: '/images/avatars/default.svg',
      points: 0,
      completedChallenges: [],
      activeChallenges: [],
      createdChallenges: []
    }
    
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    router.push('/')
  }, [router])

  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('user')
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