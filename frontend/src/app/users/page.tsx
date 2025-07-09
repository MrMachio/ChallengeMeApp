'use client'

import { useState, useMemo, useEffect } from 'react'
import { Container, Box, Typography, Stack, Tabs, Tab, Paper, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import UserCard, { UserCardSkeleton } from '@/components/UserCard'
import UsersFilters from '@/components/UsersFilters'
import ChatWindow from '@/components/ChatWindow'
import { mockUsers } from '@/lib/mock/data'
import { useAuth } from '@/lib/providers/AuthProvider'
import { friendsApi, chatApi, notificationsApi } from '@/lib/api/friends'
import type { User, FriendRequest, Chat } from '@/lib/api/friends'
import { createSkeletonArray } from '@/lib/utils'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'
import Badge from '@mui/material/Badge'

export type UserSortField = 'none' | 'points' | 'completedChallenges';
export type SortDirection = 'asc' | 'desc';
export type UserFilterType = 'all' | 'friends';

export interface UserSortConfig {
  field: UserSortField;
  direction: SortDirection;
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 120,
  fontWeight: theme.typography.fontWeightMedium,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}))

const WhatsAppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 64px - 32px)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
}))

const UsersList = styled(Box)(({ theme }) => ({
  width: '40%',
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}))

const ChatArea = styled(Box)(({ theme }) => ({
  width: '60%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}))

const ChatPlaceholder = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: theme.palette.text.secondary,
  gap: 2,
}))

// Convert users object to array
const usersArray = Object.values(mockUsers);

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortConfig, setSortConfig] = useState<UserSortConfig>({ field: 'none', direction: 'desc' })
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<typeof usersArray>([])
  const [activeTab, setActiveTab] = useState(0) // 0: Friends, 1: All Users, 2: Friend Requests
  const [friends, setFriends] = useState<User[]>([])
  const [pendingRequests, setPendingRequests] = useState<{ sent: FriendRequest[]; received: FriendRequest[] }>({ sent: [], received: [] })
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const { user: currentUser } = useAuth()

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setUsers(usersArray)
      setIsLoading(false)
    }

    loadUsers()
  }, [])

  // Load friends and requests
  useEffect(() => {
    const loadFriendsData = async () => {
      if (!currentUser) return
      
      try {
        const [friendsData, requestsData, notifCount] = await Promise.all([
          friendsApi.getFriends(currentUser.id),
          friendsApi.getPendingRequests(currentUser.id),
          notificationsApi.getUnreadCount(currentUser.id)
        ])
        
        setFriends(friendsData)
        setPendingRequests(requestsData)
        setNotificationCount(notifCount)
      } catch (error) {
        console.error('Error loading friends data:', error)
      }
    }

    loadFriendsData()
  }, [currentUser])

  // Handle user chat selection
  const handleUserChatClick = async (userId: string) => {
    if (!currentUser) return
    
    setSelectedUserId(userId)
    
    try {
      const chat = await chatApi.getOrCreateChat(currentUser.id, userId)
      setCurrentChat(chat)
      
      // Mark messages as read
      await chatApi.markMessagesAsRead(chat.id, currentUser.id)
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setSelectedUserId(null)
    setCurrentChat(null)
  }

  // Get filtered users based on active tab
  const getFilteredUsers = useMemo(() => {
    if (isLoading) return []

    let filteredUsers: User[] = []

    switch (activeTab) {
      case 0: // Friends
        filteredUsers = friends
        break
      case 1: // All Users
        filteredUsers = users.filter(user => {
          // Exclude current user
          if (currentUser && user.id === currentUser.id) {
            return false
          }
          return true
        })
        break
      case 2: // Friend Requests (show users who sent requests)
        filteredUsers = pendingRequests.received.map(req => {
          const sender = users.find(u => u.id === req.senderId)
          return sender
        }).filter(Boolean) as User[]
        break
      default:
        filteredUsers = []
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(query) ||
        (user.fullName && user.fullName.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    if (sortConfig.field !== 'none') {
      filteredUsers = [...filteredUsers].sort((a, b) => {
        const multiplier = sortConfig.direction === 'desc' ? -1 : 1;

        switch (sortConfig.field) {
          case 'points':
            return (a.points - b.points) * multiplier;
          case 'completedChallenges':
            return (a.completedChallenges.length - b.completedChallenges.length) * multiplier;
          default:
            return 0;
        }
      })
    }

    return filteredUsers
  }, [searchQuery, sortConfig, users, isLoading, currentUser, activeTab, friends, pendingRequests])

  // Create skeleton array for loading display
  const skeletonCards = createSkeletonArray(6, UserCardSkeleton)

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
        px: 0,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)'
      }}
    >


      <WhatsAppContainer>
        <UsersList>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              <StyledTab 
                icon={<PersonIcon />} 
                label="Friends" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <StyledTab 
                icon={<PeopleIcon />} 
                label="All Users" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <StyledTab 
                icon={
                  <Badge badgeContent={pendingRequests.received.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                } 
                label="Requests" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>

          {/* Filters */}
          <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
            <UsersFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType="all"
              setFilterType={() => {}}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              hideFilterSelect={true}
            />
          </Box>

          {/* Users List */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            <Stack spacing={1} sx={{ p: 1 }}>
              {isLoading ? (
                skeletonCards
              ) : (
                getFilteredUsers.map(user => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    onChatClick={handleUserChatClick}
                  />
                ))
              )}
            </Stack>

            {/* Message when no users found */}
            {!isLoading && getFilteredUsers.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  p: 3
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600
                  }}
                >
                  {activeTab === 0 && 'No friends found'}
                  {activeTab === 1 && 'No users found'}
                  {activeTab === 2 && 'No friend requests'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '300px'
                  }}
                >
                  {activeTab === 0 && 'Add friends to start chatting.'}
                  {activeTab === 1 && (searchQuery ? 
                    `No users match "${searchQuery}".` :
                    'No available users.'
                  )}
                  {activeTab === 2 && 'You have no new friend requests.'}
                </Typography>
              </Box>
            )}
          </Box>
        </UsersList>

        <ChatArea>
          {selectedUserId && currentChat ? (
            <ChatWindow 
              chat={currentChat} 
              otherUser={users.find(u => u.id === selectedUserId)!}
              onClose={() => {
                setSelectedUserId(null)
                setCurrentChat(null)
              }}
              onChatUpdate={(updatedChat) => {
                setCurrentChat(updatedChat)
              }}
            />
          ) : (
            <ChatPlaceholder>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Select a user to start chatting
              </Typography>
              <Typography variant="body2">
                Click on a user from the left to start a conversation
              </Typography>
            </ChatPlaceholder>
          )}
        </ChatArea>
      </WhatsAppContainer>
    </Container>
  )
} 