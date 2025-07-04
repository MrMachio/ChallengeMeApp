interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  points: number;
  completedChallenges: string[];
  createdChallenges: string[];
  activeChallenges: string[];
  fullName?: string;
  followers?: number;
  following?: number;
}

interface UserMap {
  [key: string]: User;
}

export const mockUsers: UserMap = {
  'user1': {
    id: 'user1',
    username: 'TechMaster',
    email: 'john@example.com',
    fullName: 'John Smith',
    avatarUrl: '/images/avatars/user1.jpg',
    points: 2500,
    completedChallenges: ['2', '4', '6', '8'],
    createdChallenges: ['1', '7'],
    activeChallenges: ['3', '5', '9'],
    followers: 120,
    following: 85
  },
  'user2': {
    id: 'user2',
    username: 'EcoWarrior',
    email: 'emma@example.com',
    fullName: 'Emma Green',
    avatarUrl: '/images/avatars/user2.jpg',
    points: 1800,
    completedChallenges: ['1', '5'],
    createdChallenges: ['2', '6'],
    activeChallenges: ['4'],
    followers: 75,
    following: 50
  },
  'user3': {
    id: 'user3',
    username: 'FitnessPro',
    email: 'mike@example.com',
    fullName: 'Mike Johnson',
    avatarUrl: '/images/avatars/user3.jpg',
    points: 3200,
    completedChallenges: ['1', '4'],
    createdChallenges: ['3'],
    activeChallenges: ['5', '6'],
    followers: 250,
    following: 120
  },
  'user4': {
    id: 'user4',
    username: 'ArtisticSoul',
    email: 'sofia@example.com',
    fullName: 'Sofia Rodriguez',
    avatarUrl: '/images/avatars/user4.jpg',
    points: 1500,
    completedChallenges: ['3', '6', '7'],
    createdChallenges: ['4'],
    activeChallenges: ['1', '2'],
    followers: 95,
    following: 88
  },
  'user5': {
    id: 'user5',
    username: 'MindfulGuru',
    email: 'david@example.com',
    fullName: 'David Chen',
    avatarUrl: '/images/avatars/user5.jpg',
    points: 2100,
    completedChallenges: [],
    createdChallenges: ['5'],
    activeChallenges: ['2', '6'],
    followers: 180,
    following: 95
  },
  'user6': {
    id: 'user6',
    username: 'BookWorm',
    email: 'lisa@example.com',
    fullName: 'Lisa Taylor',
    avatarUrl: '/images/avatars/default.svg',
    points: 1750,
    completedChallenges: ['2', '5', '8'],
    createdChallenges: ['8', '11'],
    activeChallenges: ['7', '9'],
    followers: 65,
    following: 42
  },
  'user7': {
    id: 'user7',
    username: 'GreenThumb',
    email: 'marcus@example.com',
    fullName: 'Marcus Brown',
    avatarUrl: '/images/avatars/default.svg',
    points: 2800,
    completedChallenges: ['3', '6', '9'],
    createdChallenges: ['9', '12'],
    activeChallenges: ['8', '10'],
    followers: 195,
    following: 88
  },
  'user8': {
    id: 'user8',
    username: 'ChefMaster',
    email: 'olivia@example.com',
    fullName: 'Olivia Martinez',
    avatarUrl: '/images/avatars/default.svg',
    points: 3100,
    completedChallenges: ['4', '7', '10'],
    createdChallenges: ['10', '13'],
    activeChallenges: ['9', '11'],
    followers: 280,
    following: 150
  },
  'user9': {
    id: 'user9',
    username: 'MusicLover',
    email: 'james@example.com',
    fullName: 'James Wilson',
    avatarUrl: '/images/avatars/default.svg',
    points: 1950,
    completedChallenges: ['5', '8', '11'],
    createdChallenges: ['14'],
    activeChallenges: ['10', '12'],
    followers: 110,
    following: 75
  },
  'user10': {
    id: 'user10',
    username: 'TravelBug',
    email: 'nina@example.com',
    fullName: 'Nina Patel',
    avatarUrl: '/images/avatars/default.svg',
    points: 2400,
    completedChallenges: ['6', '9', '12'],
    createdChallenges: ['15'],
    activeChallenges: ['11', '13'],
    followers: 165,
    following: 92
  }
};

// Текущий пользователь
export const mockCurrentUser = mockUsers['user1'];

interface ChallengeLikes {
  [key: string]: string[];
}

export const mockChallengeLikes: ChallengeLikes = {
  '1': ['user2', 'user3', 'user4', 'user7', 'user9'],
  '2': ['user1', 'user5', 'user6', 'user8'],
  '3': ['user1', 'user2', 'user3', 'user4', 'user7', 'user10'],
  '4': ['user2', 'user5', 'user8', 'user9'],
  '5': ['user1', 'user3', 'user4', 'user6', 'user10'],
  '6': ['user1', 'user2', 'user4', 'user5', 'user7', 'user8'],
  '7': ['user2', 'user3', 'user6', 'user9'],
  '8': ['user1', 'user4', 'user5', 'user7', 'user10'],
  '9': ['user2', 'user3', 'user6', 'user8', 'user9'],
  '10': ['user1', 'user4', 'user5', 'user7', 'user10'],
  '11': ['user2', 'user3', 'user6', 'user8'],
  '12': ['user1', 'user4', 'user7', 'user9'],
  '13': ['user2', 'user5', 'user8', 'user10'],
  '14': ['user3', 'user6', 'user7', 'user9'],
  '15': ['user1', 'user4', 'user5', 'user8', 'user10']
};

export const mockChallenges = [
  {
    id: '1',
    title: '30 Days of Coding',
    description: 'Code at least 1 hour every day for 30 days straight. Share your progress daily!',
    category: 'Educational',
    difficulty: 'Medium',
    points: 500,
    timeLimit: 720,
    creatorId: 'user1',
    imageUrl: '/images/challenges/coding.jpg',
    likesCount: 3,
    completionsCount: 58,
    creator: {
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl
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
    timeLimit: 168,
    creatorId: 'user2',
    imageUrl: '/images/challenges/zero-waste.jpg',
    likesCount: 2,
    completionsCount: 32,
    creator: {
      username: mockUsers['user2'].username,
      avatarUrl: mockUsers['user2'].avatarUrl
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
    timeLimit: 336,
    creatorId: 'user3',
    imageUrl: '/images/challenges/running.jpg',
    likesCount: 4,
    completionsCount: 75,
    creator: {
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl
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
    timeLimit: 168,
    creatorId: 'user4',
    imageUrl: '/images/challenges/digital-art.jpg',
    likesCount: 2,
    completionsCount: 28,
    creator: {
      username: mockUsers['user4'].username,
      avatarUrl: mockUsers['user4'].avatarUrl
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
    timeLimit: 504,
    creatorId: 'user5',
    imageUrl: '/images/challenges/meditation.jpg',
    likesCount: 3,
    completionsCount: 45,
    creator: {
      username: mockUsers['user5'].username,
      avatarUrl: mockUsers['user5'].avatarUrl
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
    timeLimit: 72,
    creatorId: 'user2',
    imageUrl: '/images/challenges/cleanup.jpg',
    likesCount: 3,
    completionsCount: 89,
    creator: {
      username: mockUsers['user2'].username,
      avatarUrl: mockUsers['user2'].avatarUrl
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
    timeLimit: 720,
    creatorId: 'user1',
    imageUrl: '/images/challenges/language.jpg',
    likesCount: 2,
    completionsCount: 34,
    creator: {
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl
    },
    createdAt: '2024-02-06T11:30:00Z'
  },
  {
    id: '8',
    title: 'Book Reading Marathon',
    description: 'Read 5 books in 30 days. Share your reviews and insights with the community!',
    category: 'Educational',
    difficulty: 'Medium',
    points: 450,
    timeLimit: 720,
    creatorId: 'user6',
    imageUrl: '/images/challenges/coding.jpg',
    likesCount: 5,
    completionsCount: 42,
    creator: {
      username: mockUsers['user6'].username,
      avatarUrl: mockUsers['user6'].avatarUrl
    },
    createdAt: '2024-02-09T16:20:00Z'
  },
  {
    id: '9',
    title: 'Urban Garden Project',
    description: 'Create and maintain a small urban garden for 2 weeks. Document your plant growth journey!',
    category: 'Environmental',
    difficulty: 'Easy',
    points: 350,
    timeLimit: 336,
    creatorId: 'user7',
    imageUrl: '/images/challenges/zero-waste.jpg',
    likesCount: 5,
    completionsCount: 63,
    creator: {
      username: mockUsers['user7'].username,
      avatarUrl: mockUsers['user7'].avatarUrl
    },
    createdAt: '2024-02-10T13:45:00Z'
  },
  {
    id: '10',
    title: 'Culinary Adventure',
    description: 'Cook a dish from a different cuisine every day for a week. Share your recipes and photos!',
    category: 'Creative',
    difficulty: 'Medium',
    points: 400,
    timeLimit: 168,
    creatorId: 'user8',
    imageUrl: '/images/challenges/digital-art.jpg',
    likesCount: 5,
    completionsCount: 37,
    creator: {
      username: mockUsers['user8'].username,
      avatarUrl: mockUsers['user8'].avatarUrl
    },
    createdAt: '2024-02-11T11:30:00Z'
  },
  {
    id: '11',
    title: 'Daily Reading Club',
    description: 'Read and discuss one chapter of a book daily with the community for 21 days.',
    category: 'Educational',
    difficulty: 'Easy',
    points: 300,
    timeLimit: 504,
    creatorId: 'user6',
    imageUrl: '/images/challenges/meditation.jpg',
    likesCount: 4,
    completionsCount: 51,
    creator: {
      username: mockUsers['user6'].username,
      avatarUrl: mockUsers['user6'].avatarUrl
    },
    createdAt: '2024-02-12T09:15:00Z'
  },
  {
    id: '12',
    title: 'Community Garden',
    description: 'Start a community garden project and engage local residents for 30 days.',
    category: 'Social',
    difficulty: 'Hard',
    points: 600,
    timeLimit: 720,
    creatorId: 'user7',
    imageUrl: '/images/challenges/cleanup.jpg',
    likesCount: 4,
    completionsCount: 29,
    creator: {
      username: mockUsers['user7'].username,
      avatarUrl: mockUsers['user7'].avatarUrl
    },
    createdAt: '2024-02-13T15:40:00Z'
  },
  {
    id: '13',
    title: 'Global Recipes',
    description: 'Learn and cook 15 different international recipes in 30 days.',
    category: 'Creative',
    difficulty: 'Hard',
    points: 550,
    timeLimit: 720,
    creatorId: 'user8',
    imageUrl: '/images/challenges/language.jpg',
    likesCount: 4,
    completionsCount: 33,
    creator: {
      username: mockUsers['user8'].username,
      avatarUrl: mockUsers['user8'].avatarUrl
    },
    createdAt: '2024-02-14T12:25:00Z'
  },
  {
    id: '14',
    title: 'Music Creation',
    description: 'Create a short musical piece every day for 14 days using any instrument.',
    category: 'Creative',
    difficulty: 'Medium',
    points: 450,
    timeLimit: 336,
    creatorId: 'user9',
    imageUrl: '/images/challenges/digital-art.jpg',
    likesCount: 4,
    completionsCount: 25,
    creator: {
      username: mockUsers['user9'].username,
      avatarUrl: mockUsers['user9'].avatarUrl
    },
    createdAt: '2024-02-15T10:50:00Z'
  },
  {
    id: '15',
    title: 'Virtual World Tour',
    description: 'Experience and document a different culture virtually every day for 21 days.',
    category: 'Educational',
    difficulty: 'Medium',
    points: 500,
    timeLimit: 504,
    creatorId: 'user10',
    imageUrl: '/images/challenges/language.jpg',
    likesCount: 5,
    completionsCount: 38,
    creator: {
      username: mockUsers['user10'].username,
      avatarUrl: mockUsers['user10'].avatarUrl
    },
    createdAt: '2024-02-16T14:15:00Z'
  }
].map(challenge => ({
  ...challenge,
  likesCount: (mockChallengeLikes[challenge.id] || []).length
}));

export const mockCategories = [
  { id: '1', name: 'Sports', icon: '🏃‍♂️' },
  { id: '2', name: 'Creative', icon: '🎨' },
  { id: '3', name: 'Educational', icon: '📚' },
  { id: '4', name: 'Environmental', icon: '🌱' },
  { id: '5', name: 'Social', icon: '🤝' },
  { id: '6', name: 'Other', icon: '✨' }
];

export const mockComments = [
  {
    id: '1',
    challengeId: '1',
    userId: 'user2',
    content: 'This challenge really helped me build a consistent coding habit!',
    createdAt: '2024-02-10T09:00:00Z',
    user: {
      username: mockUsers['user2'].username,
      avatarUrl: mockUsers['user2'].avatarUrl
    }
  },
  {
    id: '2',
    challengeId: '1',
    userId: 'user3',
    content: 'Day 15 and still going strong! Great challenge!',
    createdAt: '2024-02-15T14:30:00Z',
    user: {
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl
    }
  },
  {
    id: '3',
    challengeId: '4',
    userId: 'user1',
    content: 'Love seeing everyone\'s artwork! Such creativity!',
    createdAt: '2024-02-16T10:15:00Z',
    user: {
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl
    }
  },
  {
    id: '4',
    challengeId: '5',
    userId: 'user4',
    content: 'This meditation challenge has really improved my focus',
    createdAt: '2024-02-14T16:45:00Z',
    user: {
      username: mockUsers['user4'].username,
      avatarUrl: mockUsers['user4'].avatarUrl
    }
  },
  {
    id: '5',
    challengeId: '8',
    userId: 'user7',
    content: 'The book recommendations are fantastic! Already finished my second book.',
    createdAt: '2024-02-17T13:20:00Z',
    user: {
      username: mockUsers['user7'].username,
      avatarUrl: mockUsers['user7'].avatarUrl
    }
  },
  {
    id: '6',
    challengeId: '9',
    userId: 'user6',
    content: 'My herbs are growing so well! This challenge is really rewarding.',
    createdAt: '2024-02-18T11:45:00Z',
    user: {
      username: mockUsers['user6'].username,
      avatarUrl: mockUsers['user6'].avatarUrl
    }
  },
  {
    id: '7',
    challengeId: '10',
    userId: 'user9',
    content: 'The Thai curry I made yesterday was a huge hit with my family!',
    createdAt: '2024-02-19T16:30:00Z',
    user: {
      username: mockUsers['user9'].username,
      avatarUrl: mockUsers['user9'].avatarUrl
    }
  },
  {
    id: '8',
    challengeId: '13',
    userId: 'user10',
    content: 'Learning so much about different cuisines and cooking techniques!',
    createdAt: '2024-02-20T10:15:00Z',
    user: {
      username: mockUsers['user10'].username,
      avatarUrl: mockUsers['user10'].avatarUrl
    }
  }
];

interface Completion {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  rating: number;
  likes: number;
  dislikes: number;
  proofUrl: string;
  completedAt: string;
}

interface CompletionsMap {
  [key: string]: Completion[];
}

export const mockCompletions: CompletionsMap = {
  '1': [
    {
      id: 'comp1',
      userId: 'user2',
      username: mockUsers['user2'].username,
      avatarUrl: mockUsers['user2'].avatarUrl,
      rating: 4.5,
      likes: 12,
      dislikes: 1,
      proofUrl: '/images/proofs/coding-proof1.jpg',
      completedAt: '2024-02-17T10:00:00Z'
    },
    {
      id: 'completion2',
      userId: 'user3',
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl,
      rating: 5,
      likes: 45,
      dislikes: 1,
      proofUrl: '/images/proofs/coding-proof2.jpg',
      completedAt: '2024-02-16T14:30:00Z'
    }
  ],
  '2': [
    {
      id: 'completion3',
      userId: 'user1',
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl,
      rating: 4,
      likes: 28,
      dislikes: 3,
      proofUrl: '/images/proofs/waste-proof1.jpg',
      completedAt: '2024-02-14T09:15:00Z'
    }
  ],
  '3': [
    {
      id: 'completion4',
      userId: 'user4',
      username: mockUsers['user4'].username,
      avatarUrl: mockUsers['user4'].avatarUrl,
      rating: 5,
      likes: 56,
      dislikes: 0,
      proofUrl: '/images/proofs/running-proof1.jpg',
      completedAt: '2024-02-13T16:45:00Z'
    }
  ],
  '4': [
    {
      id: 'completion5',
      userId: 'user1',
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl,
      rating: 4.8,
      likes: 34,
      dislikes: 1,
      proofUrl: '/images/proofs/art-proof1.jpg',
      completedAt: '2024-02-15T11:20:00Z'
    },
    {
      id: 'completion6',
      userId: 'user3',
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl,
      rating: 4.9,
      likes: 41,
      dislikes: 0,
      proofUrl: '/images/proofs/art-proof2.jpg',
      completedAt: '2024-02-16T13:45:00Z'
    }
  ],
  '5': [
    {
      id: 'completion7',
      userId: 'user2',
      username: mockUsers['user2'].username,
      avatarUrl: mockUsers['user2'].avatarUrl,
      rating: 4.7,
      likes: 29,
      dislikes: 2,
      proofUrl: '/images/proofs/meditation-proof1.jpg',
      completedAt: '2024-02-18T09:30:00Z'
    }
  ],
  '6': [
    {
      id: 'completion8',
      userId: 'user1',
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl,
      rating: 5,
      likes: 62,
      dislikes: 1,
      proofUrl: '/images/proofs/cleanup-proof1.jpg',
      completedAt: '2024-02-19T15:20:00Z'
    },
    {
      id: 'completion9',
      userId: 'user4',
      username: mockUsers['user4'].username,
      avatarUrl: mockUsers['user4'].avatarUrl,
      rating: 4.9,
      likes: 45,
      dislikes: 0,
      proofUrl: '/images/proofs/cleanup-proof2.jpg',
      completedAt: '2024-02-20T10:15:00Z'
    }
  ],
  '7': [
    {
      id: 'completion10',
      userId: 'user4',
      username: mockUsers['user4'].username,
      avatarUrl: mockUsers['user4'].avatarUrl,
      rating: 4.8,
      likes: 38,
      dislikes: 1,
      proofUrl: '/images/proofs/language-proof1.jpg',
      completedAt: '2024-02-21T14:40:00Z'
    }
  ]
}; 