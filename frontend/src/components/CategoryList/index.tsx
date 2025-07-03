'use client'

import { mockCategories } from '@/lib/mock/data'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import './styles.css'

interface CategoryListProps {
  categories: {
    id: string
    name: string
    icon: string
  }[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(selectedCategory === category.name ? null : category.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category.name
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span className="text-lg">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  )
} 