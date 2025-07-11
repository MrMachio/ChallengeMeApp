// Temporary mock friends API - will be replaced with real backend integration
import { 
  type User, 
  type Message, 
  type Chat, 
  type FriendRequest, 
  type Notification 
} from '../mock/data';

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

// Helper functions - now return stubs since we removed mockUsers
const getCurrentUser = (): User | null => {
  // TODO: Get current user from useAuth context instead of localStorage
  return null;
};

const getOrCreateDirectChat = async (userId1: string, userId2: string): Promise<Chat> => {
  await simulateDelay();
  
  // TODO: Replace with real API call
  return {
    id: `${userId1}-${userId2}`,
    participants: [userId1, userId2],
    messages: [],
    unreadCount: 0,
    createdAt: new Date().toISOString()
  };
};

// Friends API
export const friendsApi = {
  // Get friendship status between two users
  getFriendshipStatus: async (userId1: string, userId2: string): Promise<{
    status: 'none' | 'friends' | 'pending' | 'received'
    requestId?: string
  }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { status: 'none' };
  },

  // Send friend request
  sendFriendRequest: async (senderId: string, receiverId: string): Promise<{
    success: boolean
    message: string
    requestId?: string
  }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { success: true, message: 'Friend request sent successfully' };
  },

  // Accept friend request
  acceptFriendRequest: async (requestId: string, userId: string): Promise<{
    success: boolean
    message: string
  }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { success: true, message: 'Friend request accepted successfully' };
  },

  // Reject friend request
  rejectFriendRequest: async (requestId: string, userId: string): Promise<{
    success: boolean
    message: string
  }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { success: true, message: 'Friend request rejected successfully' };
  },

  // Remove friend
  removeFriend: async (userId: string, friendId: string): Promise<{
    success: boolean
    message: string
  }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { success: true, message: 'Friend removed successfully' };
  },

  // Get friends list
  getFriends: async (userId: string): Promise<User[]> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return [];
  },

  // Get pending friend requests
  getPendingRequests: async (userId: string): Promise<{
    sent: FriendRequest[]
    received: FriendRequest[]
  }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { sent: [], received: [] };
  }
};

// Chat API
export const chatApi = {
  // Get or create direct chat
  getOrCreateDirectChat,

  // Send message
  sendMessage: async (chatId: string, senderId: string, content: string, type: 'text' | 'challenge' = 'text', challengeId?: string): Promise<Message> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId: chatId.split('-').find(id => id !== senderId) || '',
      content,
      type,
      challengeId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
  },

  // Mark messages as read
  markAsRead: async (chatId: string, userId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return { success: true };
  }
};

// Notifications API
export const notificationsApi = {
  // Get unread notifications count
  getUnreadCount: async (userId: string): Promise<number> => {
    await simulateDelay();
    // TODO: Replace with real API call
    return 0;
  }
};

// Export types
export type { User, Message, Chat, FriendRequest, Notification }; 