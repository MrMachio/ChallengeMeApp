'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Users, Trophy, Bookmark } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'

interface Challenge {
  id: string
  title: string
  description: string
  imageUrl: string | null
  createdAt: string
  creatorId: string
  category: string
  difficulty: string
  points: number
  rules: string[]
  creator: {
    username: string
    avatarUrl: string | null
  }
  likes: Array<{ user_id: string }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      username: string
      avatarUrl: string | null
    }
  }>
  completions: Array<{
    id: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    user: {
      username: string
      avatarUrl: string | null
    }
  }>
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${params.id}`)
        if (!response.ok) {
          throw new Error('Challenge not found')
        }
        const data = await response.json()
        setChallenge(data)
      } catch (error) {
        console.error('Error fetching challenge:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  const isOwner = user?.id === challenge.creatorId

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="relative h-96">
          <Image
            src={challenge.imageUrl || '/images/challenges/default.jpg'}
            alt={challenge.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm">
              {challenge.category}
            </span>
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm">
              {challenge.difficulty}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-orange-400 text-white rounded-full text-sm font-medium">
              {challenge.points} points
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{challenge.title}</h1>
            <button className="text-gray-400 hover:text-purple-600">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500">
              <Heart className="w-5 h-5" />
              <span>{challenge.likes.length} likes</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{challenge.completions.length} completions</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{challenge.description}</p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Challenge Rules:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {challenge.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <Link href={`/profile/${challenge.creator.username}`} className="flex items-center gap-3">
              <Image
                src={challenge.creator.avatarUrl || '/images/avatars/default.svg'}
                alt={challenge.creator.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{challenge.creator.username}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
                </p>
              </div>
            </Link>

            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800">
              Accept Challenge
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Recently Completed:</h2>
        <div className="space-y-4">
          {challenge.completions.map((completion) => (
            <div key={completion.id} className="flex items-center justify-between">
              <Link href={`/profile/${completion.user.username}`} className="flex items-center gap-3">
                <Image
                  src={completion.user.avatarUrl || '/images/avatars/default.svg'}
                  alt={completion.user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{completion.user.username}</p>
                  <p className="text-sm text-gray-500">
                    {completion.status === 'approved'
                      ? 'Completed'
                      : completion.status === 'rejected'
                      ? 'Rejected'
                      : 'Pending'}
                  </p>
                </div>
              </Link>
              <button className="text-purple-600 hover:text-purple-700">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Comments:</h2>
        <div className="space-y-4">
          {challenge.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Image
                src={comment.user.avatarUrl || '/images/avatars/default.svg'}
                alt={comment.user.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{comment.user.username}</p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 