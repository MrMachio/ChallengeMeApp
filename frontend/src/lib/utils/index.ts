import React from 'react'

export const getDifficultyColor = (difficulty: string) => {
  switch(difficulty.toLowerCase()) {
    case 'easy':
      return { bg: '#E8F5E9', color: '#2E7D32' }
    case 'medium':
      return { bg: '#FFF3E0', color: '#E65100' }
    case 'hard':
      return { bg: '#FFEBEE', color: '#C62828' }
    default:
      return { bg: '#F5F5F5', color: '#757575' }
  }
}

export const createSkeletonArray = (count: number, SkeletonComponent: React.ComponentType<any>) => {
  return Array.from({ length: count }, (_, index) => 
    React.createElement(SkeletonComponent, { key: `skeleton-${index}` })
  )
}

export const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchQuery) return items
  
  const query = searchQuery.toLowerCase()
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field]
      return value && String(value).toLowerCase().includes(query)
    })
  )
} 