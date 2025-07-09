interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  points: number;
  completedChallenges: string[];
  createdChallenges: string[];
  activeChallenges: string[];
  pendingChallenges: string[]; // Challenges waiting for creator approval
  favoritesChallenges: string[]; // Favorite challenges bookmarked by user
  receivedChallenges: string[]; // Challenges received from other users via chat
  fullName?: string;
  followers?: number;
  following?: number;
  friends?: string[]; // Array of user IDs who are friends
  friendRequests?: {
    sent: string[]; // Friend requests sent by this user
    received: string[]; // Friend requests received by this user
  };
  lastSeen?: string; // Last time user was online
  isOnline?: boolean; // Current online status
}

interface UserMap {
  [key: string]: User;
}

// Message interface for chat system
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'challenge'; // Type of message
  challengeId?: string; // If type is challenge, this contains the challenge ID
  timestamp: string;
  isRead: boolean;
}

// Chat interface for user conversations
interface Chat {
  id: string;
  participants: string[]; // Array of 2 user IDs
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

// Friend request interface
interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Notification interface
interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'friend_accepted' | 'message' | 'challenge_shared';
  fromUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  data?: any; // Additional data based on notification type
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
    pendingChallenges: [],
    favoritesChallenges: ['10', '11', '12'],
    receivedChallenges: [], // Received from other users via chat
    followers: 120,
    following: 85,
    friends: ['user2', 'user3', 'user5'],
    friendRequests: {
      sent: ['user7'],
      received: ['user4', 'user6']
    },
    lastSeen: new Date().toISOString(),
    isOnline: true
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
    pendingChallenges: [],
    favoritesChallenges: ['3', '7', '9'],
    receivedChallenges: [],
    followers: 75,
    following: 50,
    friends: ['user1', 'user3', 'user4'],
    friendRequests: {
      sent: ['user8'],
      received: ['user9']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['2', '8', '10'],
    receivedChallenges: [],
    followers: 250,
    following: 120,
    friends: ['user1', 'user2', 'user5'],
    friendRequests: {
      sent: ['user4'],
      received: ['user10']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['5', '9', '11'],
    receivedChallenges: [],
    followers: 95,
    following: 88,
    friends: ['user2', 'user6'],
    friendRequests: {
      sent: ['user1'],
      received: ['user3']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['1', '4', '8'],
    receivedChallenges: [],
    followers: 180,
    following: 95,
    friends: ['user1', 'user3', 'user7'],
    friendRequests: {
      sent: ['user6'],
      received: ['user8']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    isOnline: true
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
    pendingChallenges: [],
    favoritesChallenges: ['1', '3', '10'],
    receivedChallenges: [],
    followers: 65,
    following: 42,
    friends: ['user4', 'user8'],
    friendRequests: {
      sent: ['user1'],
      received: ['user5']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['2', '4', '11'],
    receivedChallenges: [],
    followers: 195,
    following: 88,
    friends: ['user5', 'user9'],
    friendRequests: {
      sent: ['user10'],
      received: ['user1']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['1', '5', '12'],
    receivedChallenges: [],
    followers: 280,
    following: 150,
    friends: ['user6', 'user10'],
    friendRequests: {
      sent: ['user5'],
      received: ['user2']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['2', '6', '13'],
    receivedChallenges: [],
    followers: 110,
    following: 75,
    friends: ['user7'],
    friendRequests: {
      sent: ['user2'],
      received: ['user10']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    isOnline: false
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
    pendingChallenges: [],
    favoritesChallenges: ['1', '4', '7'],
    receivedChallenges: [],
    followers: 165,
    following: 92,
    friends: ['user8'],
    friendRequests: {
      sent: ['user3', 'user9'],
      received: ['user7']
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isOnline: true
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

// Function to calculate user points based on completed challenges
const calculateUserPoints = (userId: string): number => {
  const user = mockUsers[userId];
  if (!user) return 0;
  
  let totalPoints = 0;
  user.completedChallenges.forEach(challengeId => {
    const challenge = mockChallenges.find(c => c.id === challengeId);
    if (challenge) {
      totalPoints += challenge.points;
    }
  });
  
  return totalPoints;
};

// Update all user points based on their completed challenges
Object.keys(mockUsers).forEach(userId => {
  mockUsers[userId].points = calculateUserPoints(userId);
});

export const mockCategories = [
  { id: '1', name: 'Educational', icon: 'SchoolIcon' },
  { id: '2', name: 'Environmental', icon: 'NatureIcon' },
  { id: '3', name: 'Sports', icon: 'FitnessCenterIcon' },
  { id: '4', name: 'Creative', icon: 'PaletteIcon' },
  { id: '5', name: 'Social', icon: 'GroupIcon' },
  { id: '6', name: 'Other', icon: 'MoreHorizIcon' }
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
  rating: number; // Average rating calculated from userRatings
  userRatings: Record<string, number>; // Individual ratings from each user (userId -> rating)
  likes: number;
  dislikes: number;
  proofUrl: string;
  proofType: 'image' | 'video'; // Type of proof media
  description: string; // User's description of how they completed the challenge
  status: 'pending' | 'approved' | 'rejected'; // Creator's approval status
  completedAt: string;
  submittedAt: string; // When the proof was submitted
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
      userRatings: { 'user1': 5, 'user3': 4, 'user4': 4, 'user5': 5 },
      likes: 12,
      dislikes: 1,
      proofUrl: '/images/proofs/coding-proof1.jpg',
      proofType: 'image',
      description: 'Completed 30 days of coding successfully! Here is my GitHub contribution chart showing daily commits for the entire month.',
      status: 'approved',
      submittedAt: '2024-02-17T09:00:00Z',
      completedAt: '2024-02-17T10:00:00Z'
    },
    {
      id: 'completion2',
      userId: 'user3',
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl,
      rating: 5,
      userRatings: { 'user1': 5, 'user2': 5, 'user4': 5, 'user5': 5, 'user6': 5 },
      likes: 45,
      dislikes: 1,
      proofUrl: '/images/proofs/coding-proof2.jpg',
      proofType: 'image',
      description: 'Amazing challenge! I built 3 different projects during these 30 days. Here\'s my final portfolio showcase.',
      status: 'approved',
      submittedAt: '2024-02-16T13:30:00Z',
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
      userRatings: { 'user2': 4, 'user3': 4, 'user4': 4, 'user5': 4 },
      likes: 28,
      dislikes: 3,
      proofUrl: '/images/proofs/waste-proof1.jpg',
      proofType: 'image',
      description: 'Managed to live zero waste for a full week! This photo shows all my waste for the week - only recyclable materials.',
      status: 'approved',
      submittedAt: '2024-02-14T08:15:00Z',
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
      userRatings: { 'user1': 5, 'user2': 5, 'user3': 5, 'user5': 5, 'user6': 5 },
      likes: 56,
      dislikes: 0,
      proofUrl: '/images/proofs/running-proof1.jpg',
      proofType: 'image',
      description: 'Successfully completed my first 5K run! Training was tough but so worth it. This is my finish line photo with my time.',
      status: 'approved',
      submittedAt: '2024-02-13T15:45:00Z',
      completedAt: '2024-02-13T16:45:00Z'
    },
    {
      id: 'completion16',
      userId: 'user6',
      username: mockUsers['user6'].username,
      avatarUrl: mockUsers['user6'].avatarUrl,
      rating: 4.7,
      userRatings: { 'user1': 5, 'user2': 4, 'user3': 5, 'user4': 4, 'user5': 5 },
      likes: 38,
      dislikes: 1,
      proofUrl: '/videos/proofs/running-video1.mp4',
      proofType: 'video',
      description: 'Here\'s my 5K training journey! This video shows my progression from struggling with 1K to completing the full 5K run. The finish line moment was incredible!',
      status: 'approved',
      submittedAt: '2024-02-14T18:30:00Z',
      completedAt: '2024-02-14T19:30:00Z'
    }
  ],
  '4': [
    {
      id: 'completion5',
      userId: 'user1',
      username: mockUsers['user1'].username,
      avatarUrl: mockUsers['user1'].avatarUrl,
      rating: 4.8,
      userRatings: { 'user2': 5, 'user3': 5, 'user4': 4, 'user5': 5 },
      likes: 34,
      dislikes: 1,
      proofUrl: '/images/proofs/art-proof1.jpg',
      proofType: 'image',
      description: 'Created 7 unique digital artworks! Each piece represents a different day and emotion. Here\'s my complete portfolio.',
      status: 'approved',
      submittedAt: '2024-02-15T10:20:00Z',
      completedAt: '2024-02-15T11:20:00Z'
    },
    {
      id: 'completion6',
      userId: 'user3',
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl,
      rating: 4.9,
      userRatings: { 'user1': 5, 'user2': 5, 'user4': 5, 'user5': 4, 'user6': 5 },
      likes: 41,
      dislikes: 0,
      proofUrl: '/images/proofs/art-proof2.jpg',
      proofType: 'image',
      description: 'What an incredible creative journey! Explored different digital art styles each day. My favorite is the abstract piece from day 5.',
      status: 'approved',
      submittedAt: '2024-02-16T12:45:00Z',
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
      userRatings: { 'user1': 5, 'user3': 4, 'user4': 5, 'user5': 5, 'user6': 4 },
      likes: 29,
      dislikes: 2,
      proofUrl: '/images/proofs/meditation-proof1.jpg',
      proofType: 'image',
      description: 'Meditation has transformed my daily routine! Started with 5 minutes and now I can easily do 20 minutes. This is my peaceful meditation corner.',
      status: 'approved',
      submittedAt: '2024-02-18T08:30:00Z',
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
      userRatings: { 'user2': 5, 'user3': 5, 'user4': 5, 'user5': 5, 'user6': 5, 'user7': 5 },
      likes: 62,
      dislikes: 1,
      proofUrl: '/images/proofs/cleanup-proof1.jpg',
      proofType: 'image',
      description: 'Organized a community clean-up event with 25 volunteers! We collected 200+ pounds of trash from the local park. What a great day!',
      status: 'approved',
      submittedAt: '2024-02-19T14:20:00Z',
      completedAt: '2024-02-19T15:20:00Z'
    },
    {
      id: 'completion9',
      userId: 'user4',
      username: mockUsers['user4'].username,
      avatarUrl: mockUsers['user4'].avatarUrl,
      rating: 4.9,
      userRatings: { 'user1': 5, 'user2': 5, 'user3': 5, 'user5': 4, 'user6': 5 },
      likes: 45,
      dislikes: 0,
      proofUrl: '/images/proofs/cleanup-proof2.jpg',
      proofType: 'image',
      description: 'Led a beach cleanup initiative! Gathered 30 people to help clean our local beach. The before and after photos are incredible.',
      status: 'approved',
      submittedAt: '2024-02-20T09:15:00Z',
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
      userRatings: { 'user1': 5, 'user2': 4, 'user3': 5, 'user5': 5, 'user6': 4 },
      likes: 38,
      dislikes: 1,
      proofUrl: '/images/proofs/language-proof1.jpg',
      proofType: 'image',
      description: 'Learned Spanish for 30 days straight! This is my language learning app showing 30 days of consistent practice. ¡Hola mundo!',
      status: 'approved',
      submittedAt: '2024-02-21T13:40:00Z',
      completedAt: '2024-02-21T14:40:00Z'
    }
  ],
  '8': [
    {
      id: 'completion11',
      userId: 'user5',
      username: mockUsers['user5'].username,
      avatarUrl: mockUsers['user5'].avatarUrl,
      rating: 0,
      userRatings: {},
      likes: 0,
      dislikes: 0,
      proofUrl: '/images/proofs/book-proof1.jpg',
      proofType: 'image',
      description: 'Just finished reading my 5th book! Here are all the books I read with my detailed reviews and notes.',
      status: 'pending',
      submittedAt: '2024-02-22T16:30:00Z',
      completedAt: '2024-02-22T16:30:00Z'
    },
    {
      id: 'completion12',
      userId: 'user9',
      username: mockUsers['user9'].username,
      avatarUrl: mockUsers['user9'].avatarUrl,
      rating: 4.5,
      userRatings: { 'user1': 5, 'user2': 4, 'user3': 4, 'user4': 5 },
      likes: 23,
      dislikes: 0,
      proofUrl: '/videos/proofs/book-video1.mp4',
      proofType: 'video',
      description: 'Made a video review of all 5 books I read this month! Each book taught me something valuable. Check out my detailed analysis and favorite quotes.',
      status: 'approved',
      submittedAt: '2024-02-22T16:30:00Z',
      completedAt: '2024-02-22T17:30:00Z'
    }
  ],
  '9': [
    {
      id: 'completion13',
      userId: 'user2',
      username: mockUsers['user2'].username,
      avatarUrl: mockUsers['user2'].avatarUrl,
      rating: 4.8,
      userRatings: { 'user1': 5, 'user3': 5, 'user4': 4, 'user5': 5, 'user6': 5 },
      likes: 47,
      dislikes: 1,
      proofUrl: '/videos/proofs/garden-video1.mp4',
      proofType: 'video',
      description: 'Time-lapse video of my urban garden project! Watch my plants grow from seeds to full vegetables over 2 weeks. So satisfying to see the progress!',
      status: 'approved',
      submittedAt: '2024-02-23T14:15:00Z',
      completedAt: '2024-02-23T15:15:00Z'
    },
    {
      id: 'completion15',
      userId: 'user7',
      username: mockUsers['user7'].username,
      avatarUrl: mockUsers['user7'].avatarUrl,
      rating: 4.6,
      userRatings: { 'user1': 5, 'user2': 4, 'user3': 5, 'user4': 4, 'user5': 5 },
      likes: 31,
      dislikes: 2,
      proofUrl: '/images/proofs/garden-proof1.jpg',
      proofType: 'image',
      description: 'Created a beautiful herb garden on my apartment balcony! These fresh herbs have transformed my cooking experience.',
      status: 'approved',
      submittedAt: '2024-02-23T07:45:00Z',
      completedAt: '2024-02-23T08:45:00Z'
    }
  ],
  '14': [
    {
      id: 'completion14',
      userId: 'user3',
      username: mockUsers['user3'].username,
      avatarUrl: mockUsers['user3'].avatarUrl,
      rating: 0,
      userRatings: {},
      likes: 0,
      dislikes: 0,
      proofUrl: '/images/proofs/book-proof2.jpg',
      proofType: 'image',
      description: 'Completed the reading marathon! These 5 books have really expanded my perspective on life and technology.',
      status: 'rejected',
      submittedAt: '2024-02-20T11:15:00Z',
      completedAt: '2024-02-20T11:15:00Z'
    }
  ]
};

// Helper function to recalculate rating based on userRatings
export const recalculateRating = (userRatings: Record<string, number>): number => {
  const ratings = Object.values(userRatings)
  if (ratings.length === 0) return 0
  
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  return Math.round(average * 10) / 10 // Round to 1 decimal place
}

// Verify rating consistency in mock data
export const verifyRatingConsistency = () => {
  let inconsistencies = 0
  
  Object.entries(mockCompletions).forEach(([challengeId, completions]) => {
    completions.forEach(completion => {
      const calculatedRating = recalculateRating(completion.userRatings)
      if (Math.abs(completion.rating - calculatedRating) > 0.1) {
        console.warn(`Rating inconsistency in completion ${completion.id}: stored=${completion.rating}, calculated=${calculatedRating}`)
        inconsistencies++
      }
    })
  })
  
  if (inconsistencies === 0) {
    console.log('✅ All ratings are consistent with userRatings')
  } else {
    console.log(`❌ Found ${inconsistencies} rating inconsistencies`)
  }
  
  return inconsistencies
} 

// Mock data for chats and messages
export const mockChats: { [key: string]: Chat } = {
  'user1-user2': {
    id: 'user1-user2',
    participants: ['user1', 'user2'],
    messages: [
      {
        id: 'msg1',
        senderId: 'user1',
        receiverId: 'user2',
        content: 'Привет! Как дела с эко-проектом?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'user2',
        receiverId: 'user1',
        content: 'Отлично! Уже почти завершил. А у тебя как с кодингом?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'user1',
        receiverId: 'user2',
        content: 'Попробуй это задание! Думаю, тебе понравится',
        type: 'challenge',
        challengeId: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        isRead: false
      }
    ],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  'user1-user3': {
    id: 'user1-user3',
    participants: ['user1', 'user3'],
    messages: [
      {
        id: 'msg4',
        senderId: 'user3',
        receiverId: 'user1',
        content: 'Привет! Видел твое последнее задание - круто!',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        isRead: true
      },
      {
        id: 'msg5',
        senderId: 'user1',
        receiverId: 'user3',
        content: 'Спасибо! Давай вместе что-то сделаем',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        isRead: true
      }
    ],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
};

// Mock data for notifications
export const mockNotifications: { [key: string]: Notification[] } = {
  'user1': [
    {
      id: 'notif1',
      userId: 'user1',
      type: 'friend_request',
      fromUserId: 'user4',
      content: 'ArtisticSoul хочет добавить вас в друзья',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      data: { requestId: 'req1' }
    },
    {
      id: 'notif2',
      userId: 'user1',
      type: 'friend_request',
      fromUserId: 'user6',
      content: 'BookWorm хочет добавить вас в друзья',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      data: { requestId: 'req2' }
    }
  ],
  'user2': [
    {
      id: 'notif3',
      userId: 'user2',
      type: 'friend_request',
      fromUserId: 'user9',
      content: 'MusicLover хочет добавить вас в друзья',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      data: { requestId: 'req3' }
    },
    {
      id: 'notif4',
      userId: 'user2',
      type: 'message',
      fromUserId: 'user1',
      content: 'Новое сообщение от TechMaster',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      data: { chatId: 'user1-user2', messageId: 'msg3' }
    }
  ]
};

// Mock data for friend requests
export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req1',
    senderId: 'user4',
    receiverId: 'user1',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 'req2',
    senderId: 'user6',
    receiverId: 'user1',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'req3',
    senderId: 'user9',
    receiverId: 'user2',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

// Export types for external usage
export type { User, Message, Chat, FriendRequest, Notification }; 