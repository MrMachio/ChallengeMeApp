import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import keycloak from '@/lib/keycloak'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Здесь должен быть код для получения челленджа из базы данных
    // Пример заглушки:
    const challenge = {
      id: params.id,
      title: 'Sample Challenge',
      description: 'This is a sample challenge',
      category: 'fitness',
      difficulty: 'medium',
      image_url: 'https://example.com/image.jpg',
      created_at: new Date().toISOString(),
      user_id: '123',
    }

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 