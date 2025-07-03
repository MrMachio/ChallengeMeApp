'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface FiltersProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  selectedDifficulty: string | null
  onSelectDifficulty: (difficulty: string | null) => void
  sortBy: 'newest' | 'popular' | 'points'
  onSortChange: (sort: 'newest' | 'popular' | 'points') => void
  onSearch?: (query: string) => void
  categories: Array<{
    id: string
    name: string
    icon: string
  }>
}

export default function Filters({
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  sortBy,
  onSortChange,
  onSearch = () => {},
  categories,
}: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const difficulties = ['Легкий', 'Средний', 'Сложный']
  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'popular', label: 'Популярные' },
    { value: 'points', label: 'По очкам' },
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
      {/* Поисковая строка */}
      <div className="relative flex-grow max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search challenges..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Выпадающий список категорий */}
        <div className="relative">
          <select
            value={selectedCategory || ''}
            onChange={(e) => onSelectCategory(e.target.value === '' ? null : e.target.value)}
            className="block w-40 rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Выпадающий список сложности */}
        <div className="relative">
          <select
            value={selectedDifficulty || ''}
            onChange={(e) => onSelectDifficulty(e.target.value === '' ? null : e.target.value)}
            className="block w-40 rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
          >
            <option value="">All Difficulties</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Выпадающий список сортировки */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'popular' | 'points')}
            className="block w-40 rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
} 