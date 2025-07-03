'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trophy, Users, BookOpen } from 'lucide-react'
import ChallengeCard from '@/components/ChallengeCard'

interface Challenge {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  difficulty: string
  points: number
  likes: number
  participants: number
  completions: number
  author: {
    name: string
    avatar: string
  }
}

interface ProfileProps {
  params: {
    username: string
  }
}

export default function Profile({ params }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('active')
  const [userStats] = useState({
    completed: 23,
    active: 5,
    created: 8,
    points: 1540,
    level: 12
  })

  const [mockChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Cook at Home for 21 Days',
      description: 'Cook all your meals at home for 21 days without ordering takeout',
      imageUrl: '/images/cooking.jpg',
      category: 'Health',
      difficulty: 'Medium',
      points: 180,
      likes: 2103,
      participants: 1534,
      completions: 892,
      author: {
        name: params.username,
        avatar: '/images/avatars/default.jpg'
      }
    }
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-start gap-6">
          <Image
            src="/images/avatars/default.jpg"
            alt={params.username}
            width={100}
            height={100}
            className="rounded-full"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold mb-1">{params.username}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Trophy className="w-5 h-5" />
                  <span>Level {userStats.level}</span>
                  <span className="text-orange-500 font-medium">{userStats.points} points</span>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add Friend
              </button>
            </div>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>{userStats.completed} completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{userStats.active} active</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{userStats.created} created</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {['active', 'completed', 'created'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            {...challenge}
          />
        ))}
      </div>
    </div>
  )
} 