export const mockUsers = [
  {
    id: 'user1',
    username: 'TechMaster',
    fullName: 'John Smith',
    avatarUrl: '/images/avatars/user1.jpg',
    points: 2500,
    completedChallenges: 15,
    createdChallenges: 5,
    followers: 120,
    following: 85
  },
  {
    id: 'user2',
    username: 'EcoWarrior',
    fullName: 'Emma Green',
    avatarUrl: '/images/avatars/user2.jpg',
    points: 1800,
    completedChallenges: 12,
    createdChallenges: 3,
    followers: 75,
    following: 50
  },
  {
    id: 'user3',
    username: 'FitnessPro',
    fullName: 'Mike Johnson',
    avatarUrl: '/images/avatars/user3.jpg',
    points: 3200,
    completedChallenges: 20,
    createdChallenges: 8,
    followers: 250,
    following: 120
  },
  {
    id: 'user4',
    username: 'ArtisticSoul',
    fullName: 'Sofia Rodriguez',
    avatarUrl: '/images/avatars/user4.jpg',
    points: 1500,
    completedChallenges: 10,
    createdChallenges: 4,
    followers: 95,
    following: 88
  },
  {
    id: 'user5',
    username: 'MindfulGuru',
    fullName: 'David Chen',
    avatarUrl: '/images/avatars/user5.jpg',
    points: 2100,
    completedChallenges: 14,
    createdChallenges: 6,
    followers: 180,
    following: 95
  }
]

export const mockChallenges = [
  {
    id: '1',
    title: '30 Days of Coding',
    description: 'Code at least 1 hour every day for 30 days straight. Share your progress daily!',
    category: 'Educational',
    difficulty: 'Medium',
    points: 500,
    timeLimit: 720, // 30 days in hours
    creatorId: 'user1',
    imageUrl: '/images/challenges/coding.jpg',
    likesCount: 245,
    completionsCount: 58,
    creator: {
      username: 'TechMaster',
      avatarUrl: '/images/avatars/user1.jpg'
    },
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Zero Waste Week',
    description: 'Live a week without producing any non-recyclable waste. Document your journey!',
    category: 'Environmental',
    difficulty: 'Easy',
    points: 300,
    timeLimit: 168, // 7 days in hours
    creatorId: 'user2',
    imageUrl: '/images/challenges/zero-waste.jpg',
    likesCount: 189,
    completionsCount: 32,
    creator: {
      username: 'EcoWarrior',
      avatarUrl: '/images/avatars/user2.jpg'
    },
    createdAt: '2024-02-05T15:30:00Z'
  },
  {
    id: '3',
    title: '5K Training Challenge',
    description: 'Train and complete a 5K run. Perfect for beginners!',
    category: 'Sports',
    difficulty: 'Hard',
    points: 400,
    timeLimit: 336, // 14 days in hours
    creatorId: 'user3',
    imageUrl: '/images/challenges/running.jpg',
    likesCount: 312,
    completionsCount: 75,
    creator: {
      username: 'FitnessPro',
      avatarUrl: '/images/avatars/user3.jpg'
    },
    createdAt: '2024-02-03T08:15:00Z'
  },
  {
    id: '4',
    title: 'Digital Art Portfolio',
    description: 'Create one digital artwork every day for 7 days to build your portfolio',
    category: 'Creative',
    difficulty: 'Medium',
    points: 350,
    timeLimit: 168, // 7 days in hours
    creatorId: 'user4',
    imageUrl: '/images/challenges/digital-art.jpg',
    likesCount: 156,
    completionsCount: 28,
    creator: {
      username: 'ArtisticSoul',
      avatarUrl: '/images/avatars/user4.jpg'
    },
    createdAt: '2024-02-08T12:00:00Z'
  },
  {
    id: '5',
    title: '21 Days of Meditation',
    description: 'Build a daily meditation practice. Start with 5 minutes and work your way up to 20 minutes.',
    category: 'Other',
    difficulty: 'Easy',
    points: 450,
    timeLimit: 504, // 21 days in hours
    creatorId: 'user5',
    imageUrl: '/images/challenges/meditation.jpg',
    likesCount: 278,
    completionsCount: 45,
    creator: {
      username: 'MindfulGuru',
      avatarUrl: '/images/avatars/user5.jpg'
    },
    createdAt: '2024-02-04T09:45:00Z'
  },
  {
    id: '6',
    title: 'Community Clean-up',
    description: 'Organize and lead a community clean-up event in your local area',
    category: 'Social',
    difficulty: 'Medium',
    points: 600,
    timeLimit: 72, // 3 days in hours
    creatorId: 'user2',
    imageUrl: '/images/challenges/cleanup.jpg',
    likesCount: 423,
    completionsCount: 89,
    creator: {
      username: 'EcoWarrior',
      avatarUrl: '/images/avatars/user2.jpg'
    },
    createdAt: '2024-02-07T14:20:00Z'
  },
  {
    id: '7',
    title: 'Learn a New Language',
    description: 'Complete 30 minutes of language learning daily for 30 days',
    category: 'Educational',
    difficulty: 'Hard',
    points: 550,
    timeLimit: 720, // 30 days in hours
    creatorId: 'user1',
    imageUrl: '/images/challenges/language.jpg',
    likesCount: 198,
    completionsCount: 34,
    creator: {
      username: 'TechMaster',
      avatarUrl: '/images/avatars/user1.jpg'
    },
    createdAt: '2024-02-06T11:30:00Z'
  }
]

export const mockCategories = [
  { id: '1', name: 'Sports', icon: '🏃‍♂️' },
  { id: '2', name: 'Creative', icon: '🎨' },
  { id: '3', name: 'Educational', icon: '📚' },
  { id: '4', name: 'Environmental', icon: '🌱' },
  { id: '5', name: 'Social', icon: '🤝' },
  { id: '6', name: 'Other', icon: '✨' }
]

export const mockUser = {
  id: 'current-user',
  username: 'ChallengeSeeker',
  fullName: 'Alex Thompson',
  avatarUrl: '/images/avatars/current-user.jpg',
  points: 1250,
  completedChallenges: 8,
  createdChallenges: 3,
  followers: 45,
  following: 32
}

export const mockComments = [
  {
    id: '1',
    challengeId: '1',
    userId: 'user2',
    content: 'This challenge really helped me build a consistent coding habit!',
    createdAt: '2024-02-10T09:00:00Z',
    user: {
      username: 'EcoWarrior',
      avatarUrl: '/images/avatars/user2.jpg'
    }
  },
  {
    id: '2',
    challengeId: '1',
    userId: 'user3',
    content: 'Day 15 and still going strong! Great challenge!',
    createdAt: '2024-02-15T14:30:00Z',
    user: {
      username: 'FitnessPro',
      avatarUrl: '/images/avatars/user3.jpg'
    }
  },
  {
    id: '3',
    challengeId: '4',
    userId: 'user1',
    content: 'Love seeing everyone\'s artwork! Such creativity!',
    createdAt: '2024-02-16T10:15:00Z',
    user: {
      username: 'TechMaster',
      avatarUrl: '/images/avatars/user1.jpg'
    }
  },
  {
    id: '4',
    challengeId: '5',
    userId: 'user4',
    content: 'This meditation challenge has really improved my focus',
    createdAt: '2024-02-14T16:45:00Z',
    user: {
      username: 'ArtisticSoul',
      avatarUrl: '/images/avatars/user4.jpg'
    }
  }
] 