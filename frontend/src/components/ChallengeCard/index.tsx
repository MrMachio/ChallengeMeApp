'use client'

import Image from 'next/image'
import { HeartIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import './styles.css'

interface ChallengeCardProps {
  challenge: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    points: number
    timeLimit: number | null
    imageUrl: string | null
    likesCount: number
    completionsCount: number
    creator: {
      username: string
      avatarUrl: string
    }
    createdAt: string
  }
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(challenge.likesCount)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(current => isLiked ? current - 1 : current + 1)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative aspect-video">
        {challenge.imageUrl ? (
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Нет изображения</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
              {challenge.category}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
              {challenge.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
              {challenge.points} очков
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/challenge/${challenge.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
            {challenge.title}
          </h3>
        </Link>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {challenge.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {isLiked ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span>{likesCount}</span>
            </button>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <UserGroupIcon className="w-5 h-5" />
              <span>{challenge.completionsCount}</span>
            </div>
            
            {challenge.timeLimit && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <ClockIcon className="w-5 h-5" />
                <span>{challenge.timeLimit}ч</span>
              </div>
            )}
          </div>

          <Link
            href={`/profile/${challenge.creator.username}`}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={challenge.creator.avatarUrl}
                alt={challenge.creator.username}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-gray-600">
              {challenge.creator.username}
            </span>
          </Link>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
} 