'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useAuth as useAuthHook, User } from '../hooks/useAuth'

// Экспортируем тип User для использования в других компонентах
export type { User }

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, firstName?: string, lastName?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Для обратной совместимости
export function useAuthContext() {
  return useAuth()
} 