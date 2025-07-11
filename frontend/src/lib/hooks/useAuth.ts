import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
  favoritesChallenges: string[]
}

interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
    points: number
    activeChallenges: string[]
    pendingChallenges: string[]
    completedChallenges: string[]
    favoritesChallenges: string[]
    createdChallenges: string[]
  }
  token: {
    accessToken: string
    expiresAt: string
    refreshToken: string
    refreshExpiresAt: string
  }
}

interface UserResponse {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  points: number
  activeChallenges: string[]
  pendingChallenges: string[]
  completedChallenges: string[]
  favoritesChallenges: string[]
  createdChallenges: string[]
}

const API_BASE_URL = 'http://localhost:8081'

// Utility functions for localStorage
const saveUserToStorage = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
}

const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing user from storage:', error)
    return null
  }
}

const clearUserFromStorage = () => {
  localStorage.removeItem('user')
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Проверка токена и получение данных пользователя
  const verifyToken = useCallback(async (token: string): Promise<User | null> => {
    try {
      // TODO: Когда /auth/me будет реализован в backend'е, раскомментировать этот код
      /*
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const userData: UserResponse = await response.json()
        const user: User = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          fullName: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : userData.firstName || userData.lastName,
          avatarUrl: userData.avatarUrl || '/images/avatars/default.svg',
          points: userData.points || 0,
          completedChallenges: userData.completedChallenges || [],
          activeChallenges: userData.activeChallenges || [],
          createdChallenges: userData.createdChallenges || [],
          pendingChallenges: userData.pendingChallenges || [],
          favoritesChallenges: userData.favoritesChallenges || [],
        }
        return user
      }
      */
      
      // Временное решение: получаем пользователя из localStorage
      // Это работает пока не реализован эндпоинт /auth/me
      const storedUser = getUserFromStorage()
      if (storedUser && token) {
        return storedUser
      }
      
      return null
    } catch (error) {
      console.error('Error verifying token:', error)
      return null
    }
  }, [])

  // Обновление токена
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      if (!refreshTokenValue) return false

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshTokenValue,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('expiresAt', data.expiresAt)
        localStorage.setItem('refreshExpiresAt', data.refreshExpiresAt)
        
        const userData = await verifyToken(data.accessToken)
        if (userData) {
          setUser(userData)
          saveUserToStorage(userData)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
  }, [verifyToken])

  // Инициализация при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const expiresAt = localStorage.getItem('expiresAt')
        const storedUser = getUserFromStorage()
        
        if (accessToken && expiresAt && storedUser) {
          const isExpired = new Date(expiresAt) <= new Date()
          
          if (isExpired) {
            // Попытка обновить токен
            const refreshed = await refreshToken()
            if (!refreshed) {
              // Если обновление не удалось, очищаем все данные
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('expiresAt')
              localStorage.removeItem('refreshExpiresAt')
              clearUserFromStorage()
            }
          } else {
            // Токен действителен, восстанавливаем пользователя
            setUser(storedUser)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [refreshToken])

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Backend expects username field
          password,
        }),
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        
        // Сохраняем токены
        localStorage.setItem('accessToken', data.token.accessToken)
        localStorage.setItem('refreshToken', data.token.refreshToken)
        localStorage.setItem('expiresAt', data.token.expiresAt)
        localStorage.setItem('refreshExpiresAt', data.token.refreshExpiresAt)
        
        // Используем данные пользователя из ответа login напрямую
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          fullName: data.user.firstName && data.user.lastName 
            ? `${data.user.firstName} ${data.user.lastName}`
            : data.user.firstName || data.user.lastName,
          avatarUrl: data.user.avatarUrl || '/images/avatars/default.svg',
          points: data.user.points || 0,
          completedChallenges: data.user.completedChallenges || [],
          activeChallenges: data.user.activeChallenges || [],
          createdChallenges: data.user.createdChallenges || [],
          pendingChallenges: data.user.pendingChallenges || [],
          favoritesChallenges: data.user.favoritesChallenges || [],
        }
        setUser(user)
        saveUserToStorage(user) // Сохраняем пользователя в localStorage
        
        // Отправляем событие для обновления UI
        window.dispatchEvent(new Event('userUpdated'))
        router.push('/')
      } else {
        const errorText = await response.text()
        console.error('Login failed with status:', response.status, 'Response:', errorText)
        throw new Error(`Login failed: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [router])

  const signUp = useCallback(async (email: string, password: string, username: string, firstName?: string, lastName?: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          firstName: firstName || username, // Используем firstName или username как fallback
          lastName: lastName,
        }),
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        
        // Сохраняем токены
        localStorage.setItem('accessToken', data.token.accessToken)
        localStorage.setItem('refreshToken', data.token.refreshToken)
        localStorage.setItem('expiresAt', data.token.expiresAt)
        localStorage.setItem('refreshExpiresAt', data.token.refreshExpiresAt)
        
        // Используем данные пользователя из ответа регистрации напрямую
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          fullName: data.user.firstName && data.user.lastName 
            ? `${data.user.firstName} ${data.user.lastName}`
            : data.user.firstName || data.user.lastName,
          avatarUrl: data.user.avatarUrl || '/images/avatars/default.svg',
          points: data.user.points || 0,
          completedChallenges: data.user.completedChallenges || [],
          activeChallenges: data.user.activeChallenges || [],
          createdChallenges: data.user.createdChallenges || [],
          pendingChallenges: data.user.pendingChallenges || [],
          favoritesChallenges: data.user.favoritesChallenges || [],
        }
        setUser(user)
        saveUserToStorage(user) // Сохраняем пользователя в localStorage
        
        // Отправляем событие для обновления UI
        window.dispatchEvent(new Event('userUpdated'))
        router.push('/')
      } else {
        const errorText = await response.text()
        console.error('Registration failed with status:', response.status, 'Response:', errorText)
        throw new Error(`Registration failed: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [router])

  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('refreshExpiresAt')
    clearUserFromStorage() // Удаляем пользователя из localStorage
    
    // Отправляем событие для обновления UI
    window.dispatchEvent(new Event('userUpdated'))
    router.push('/')
  }, [router])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
} 