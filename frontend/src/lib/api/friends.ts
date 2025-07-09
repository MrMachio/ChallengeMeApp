import { 
  mockUsers, 
  mockChats, 
  mockNotifications, 
  mockFriendRequests,
  type User, 
  type Message, 
  type Chat, 
  type FriendRequest, 
  type Notification 
} from '../mock/data';

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

// Helper functions
const getCurrentUser = (): User | null => {
  try {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId && mockUsers[currentUserId]) {
      return mockUsers[currentUserId];
    }
  } catch (error) {
    console.error('Error loading user ID from localStorage:', error);
  }
  return null;
};

const saveUserChanges = () => {
  try {
    window.dispatchEvent(new Event('userUpdated'));
  } catch (error) {
    console.error('Error saving user changes:', error);
  }
};

// Friends API
export const friendsApi = {
  // Get friendship status between two users
  getFriendshipStatus: async (userId1: string, userId2: string): Promise<'none' | 'friends' | 'pending' | 'received'> => {
    await simulateDelay();
    
    const user1 = mockUsers[userId1];
    const user2 = mockUsers[userId2];
    
    if (!user1 || !user2) return 'none';
    
    // Check if they are friends
    if (user1.friends?.includes(userId2)) return 'friends';
    
    // Check if user1 sent a request to user2
    if (user1.friendRequests?.sent.includes(userId2)) return 'pending';
    
    // Check if user1 received a request from user2
    if (user1.friendRequests?.received.includes(userId2)) return 'received';
    
    return 'none';
  },

  // Send friend request
  sendFriendRequest: async (senderId: string, receiverId: string): Promise<{ success: boolean; message: string }> => {
    await simulateDelay();
    
    const sender = mockUsers[senderId];
    const receiver = mockUsers[receiverId];
    
    if (!sender || !receiver) {
      return { success: false, message: 'User not found' };
    }
    
    if (sender.friends?.includes(receiverId)) {
      return { success: false, message: 'Already friends' };
    }
    
    if (sender.friendRequests?.sent.includes(receiverId)) {
      return { success: false, message: 'Request already sent' };
    }
    
    // Add to sender's sent requests
    if (!sender.friendRequests) sender.friendRequests = { sent: [], received: [] };
    sender.friendRequests.sent.push(receiverId);
    
    // Add to receiver's received requests
    if (!receiver.friendRequests) receiver.friendRequests = { sent: [], received: [] };
    receiver.friendRequests.received.push(senderId);
    
    // Create friend request record
    const newRequest: FriendRequest = {
      id: `req_${Date.now()}`,
      senderId,
      receiverId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockFriendRequests.push(newRequest);
    
    // Create notification for receiver
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId: receiverId,
      type: 'friend_request',
      fromUserId: senderId,
      content: `${sender.username} хочет добавить вас в друзья`,
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { requestId: newRequest.id }
    };
    
    if (!mockNotifications[receiverId]) mockNotifications[receiverId] = [];
    mockNotifications[receiverId].push(notification);
    
    saveUserChanges();
    
    return { success: true, message: 'Friend request sent' };
  },

  // Accept friend request
  acceptFriendRequest: async (requestId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    await simulateDelay();
    
    const request = mockFriendRequests.find(r => r.id === requestId);
    if (!request || request.receiverId !== userId) {
      return { success: false, message: 'Request not found' };
    }
    
    const sender = mockUsers[request.senderId];
    const receiver = mockUsers[request.receiverId];
    
    if (!sender || !receiver) {
      return { success: false, message: 'User not found' };
    }
    
    // Add to each other's friends list
    if (!sender.friends) sender.friends = [];
    if (!receiver.friends) receiver.friends = [];
    
    sender.friends.push(request.receiverId);
    receiver.friends.push(request.senderId);
    
    // Remove from friend requests
    if (sender.friendRequests?.sent) {
      sender.friendRequests.sent = sender.friendRequests.sent.filter(id => id !== request.receiverId);
    }
    if (receiver.friendRequests?.received) {
      receiver.friendRequests.received = receiver.friendRequests.received.filter(id => id !== request.senderId);
    }
    
    // Update request status
    request.status = 'accepted';
    
    // Create notification for sender
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId: request.senderId,
      type: 'friend_accepted',
      fromUserId: request.receiverId,
      content: `${receiver.username} принял ваш запрос на дружбу`,
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { friendId: request.receiverId }
    };
    
    if (!mockNotifications[request.senderId]) mockNotifications[request.senderId] = [];
    mockNotifications[request.senderId].push(notification);
    
    saveUserChanges();
    
    return { success: true, message: 'Friend request accepted' };
  },

  // Reject friend request
  rejectFriendRequest: async (requestId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    await simulateDelay();
    
    const request = mockFriendRequests.find(r => r.id === requestId);
    if (!request || request.receiverId !== userId) {
      return { success: false, message: 'Request not found' };
    }
    
    const sender = mockUsers[request.senderId];
    const receiver = mockUsers[request.receiverId];
    
    if (!sender || !receiver) {
      return { success: false, message: 'User not found' };
    }
    
    // Remove from friend requests
    if (sender.friendRequests?.sent) {
      sender.friendRequests.sent = sender.friendRequests.sent.filter(id => id !== request.receiverId);
    }
    if (receiver.friendRequests?.received) {
      receiver.friendRequests.received = receiver.friendRequests.received.filter(id => id !== request.senderId);
    }
    
    // Update request status
    request.status = 'rejected';
    
    saveUserChanges();
    
    return { success: true, message: 'Friend request rejected' };
  },

  // Get user's friends
  getFriends: async (userId: string): Promise<User[]> => {
    await simulateDelay();
    
    const user = mockUsers[userId];
    if (!user || !user.friends) return [];
    
    return user.friends.map(friendId => mockUsers[friendId]).filter(Boolean);
  },

  // Remove friend
  removeFriend: async (userId: string, friendId: string): Promise<{ success: boolean; message: string }> => {
    await simulateDelay();
    
    const user = mockUsers[userId];
    const friend = mockUsers[friendId];
    
    if (!user || !friend) {
      return { success: false, message: 'User not found' };
    }
    
    // Remove from both users' friends lists
    if (user.friends) {
      user.friends = user.friends.filter(id => id !== friendId);
    }
    if (friend.friends) {
      friend.friends = friend.friends.filter(id => id !== userId);
    }
    
    saveUserChanges();
    
    return { success: true, message: 'Friend removed successfully' };
  },

  // Get pending friend requests for user
  getPendingRequests: async (userId: string): Promise<{ sent: FriendRequest[]; received: FriendRequest[] }> => {
    await simulateDelay();
    
    const sent = mockFriendRequests.filter(r => r.senderId === userId && r.status === 'pending');
    const received = mockFriendRequests.filter(r => r.receiverId === userId && r.status === 'pending');
    
    return { sent, received };
  }
};

// Notifications API
export const notificationsApi = {
  // Get user notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await simulateDelay();
    
    return mockNotifications[userId] || [];
  },

  // Mark notification as read
  markAsRead: async (notificationId: string, userId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    
    const userNotifications = mockNotifications[userId];
    if (!userNotifications) return { success: false };
    
    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification) return { success: false };
    
    notification.isRead = true;
    
    return { success: true };
  },

  // Get unread notifications count
  getUnreadCount: async (userId: string): Promise<number> => {
    await simulateDelay();
    
    const userNotifications = mockNotifications[userId];
    if (!userNotifications) return 0;
    
    return userNotifications.filter(n => !n.isRead).length;
  }
};

// Chat API
export const chatApi = {
  // Get or create chat between two users
  getOrCreateChat: async (userId1: string, userId2: string): Promise<Chat> => {
    await simulateDelay();
    
    const chatId1 = `${userId1}-${userId2}`;
    const chatId2 = `${userId2}-${userId1}`;
    
    let chat = mockChats[chatId1] || mockChats[chatId2];
    
    if (!chat) {
      // Create new chat
      chat = {
        id: chatId1,
        participants: [userId1, userId2],
        messages: [],
        unreadCount: 0,
        createdAt: new Date().toISOString()
      };
      mockChats[chatId1] = chat;
    }
    
    return chat;
  },

  // Send message
  sendMessage: async (chatId: string, senderId: string, content: string, type: 'text' | 'challenge' = 'text', challengeId?: string): Promise<Message> => {
    await simulateDelay();
    
    const chat = mockChats[chatId];
    if (!chat) throw new Error('Chat not found');
    
    const receiverId = chat.participants.find(id => id !== senderId);
    if (!receiverId) throw new Error('Receiver not found');
    
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      content,
      type,
      challengeId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    chat.messages.push(message);
    chat.lastMessage = message;
    chat.unreadCount++;
    
    // If it's a challenge message, add to receiver's receivedChallenges
    if (type === 'challenge' && challengeId) {
      const receiver = mockUsers[receiverId];
      if (receiver) {
        if (!receiver.receivedChallenges) receiver.receivedChallenges = [];
        if (!receiver.receivedChallenges.includes(challengeId)) {
          receiver.receivedChallenges.push(challengeId);
          // Dispatch event to update profile
          window.dispatchEvent(new CustomEvent('challengeReceived', { detail: { receiverId, challengeId } }));
        }
      }
    }
    
    // Create notification for receiver
    const sender = mockUsers[senderId];
    if (sender) {
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        userId: receiverId,
        type: type === 'challenge' ? 'challenge_shared' : 'message',
        fromUserId: senderId,
        content: type === 'challenge' ? `${sender.username} поделился заданием` : `Новое сообщение от ${sender.username}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: { chatId, messageId: message.id, challengeId }
      };
      
      if (!mockNotifications[receiverId]) mockNotifications[receiverId] = [];
      mockNotifications[receiverId].push(notification);
    }
    
    // Save changes to localStorage
    saveUserChanges();
    
    return message;
  },

  // Get user's chats
  getUserChats: async (userId: string): Promise<Chat[]> => {
    await simulateDelay();
    
    return Object.values(mockChats).filter(chat => chat.participants.includes(userId));
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId: string, userId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    
    const chat = mockChats[chatId];
    if (!chat) return { success: false };
    
    chat.messages.forEach(message => {
      if (message.receiverId === userId) {
        message.isRead = true;
      }
    });
    
    chat.unreadCount = 0;
    
    return { success: true };
  }
};

// Export types
export type { User, Message, Chat, FriendRequest, Notification }; 