'use client'

import { useState } from 'react'
import ChallengeCard from '@/components/ChallengeCard'
import Filters from '@/components/Filters'
import { mockChallenges, mockCategories } from '@/lib/mock/data'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'points'>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  // Фильтрация челленджей
  const filteredChallenges = mockChallenges.filter(challenge => {
    if (selectedCategory && challenge.category !== selectedCategory) return false
    if (selectedDifficulty && challenge.difficulty !== selectedDifficulty) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.category.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Сортировка челленджей
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.likesCount - a.likesCount
      case 'points':
        return b.points - a.points
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero секция */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Бросьте себе вызов!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Присоединяйтесь к сообществу, создавайте и выполняйте интересные челленджи, 
            развивайтесь и получайте награды.
          </p>
        </div>

        {/* Фильтры и поиск */}
        <div className="mb-8">
          <Filters
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSearch={setSearchQuery}
          />
        </div>

        {/* Список челленджей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>

        {/* Сообщение, если нет челленджей */}
        {sortedChallenges.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Челленджи не найдены
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры фильтрации или создайте свой челлендж!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
