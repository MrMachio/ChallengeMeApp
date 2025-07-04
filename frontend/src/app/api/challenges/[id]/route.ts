import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockChallenges, mockComments } from '@/lib/mock/data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = mockChallenges.find(c => c.id === params.id)
    
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Добавляем комментарии и правила к задаче
    const challengeWithDetails = {
      ...challenge,
      rules: [
        'Document your progress daily',
        'Share your experience with the community',
        'Be honest and consistent',
        'Support other participants'
      ],
      comments: mockComments.filter(comment => comment.challengeId === challenge.id),
      completions: [], // Пока пустой массив для демонстрации
      likes: [] // Пока пустой массив для демонстрации
    }

    return NextResponse.json(challengeWithDetails)
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 