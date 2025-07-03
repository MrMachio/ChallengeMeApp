import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import keycloak from '@/lib/keycloak'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Здесь должен быть код для получения челленджей из базы данных
    // Пример заглушки:
    return NextResponse.json([
      {
        id: '1',
        title: 'Sample Challenge',
        description: 'This is a sample challenge',
        category: 'fitness',
        difficulty: 'medium',
        image_url: 'https://example.com/image.jpg',
      },
    ])
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Здесь должен быть код для сохранения челленджа в базу данных
    // Пример заглушки:
    const challenge = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 