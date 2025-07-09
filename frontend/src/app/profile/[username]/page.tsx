'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  Slide,
  TextField,
  InputAdornment,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupIcon from '@mui/icons-material/Group'
import CreateIcon from '@mui/icons-material/Create'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import ChallengeCard, { ChallengeCardSkeleton } from '@/components/ChallengeCard'
import UserCard, { UserCardSkeleton } from '@/components/UserCard'
import { mockUsers, mockChallenges } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'
import { createSkeletonArray } from '@/lib/utils'
import { friendsApi, notificationsApi } from '@/lib/api/friends'
import type { User, FriendRequest } from '@/lib/api/friends'
import UsersFilters from '@/components/UsersFilters'
import type { UserSortConfig, UserSortField, UserFilterType } from '@/app/users/page'

interface ProfileProps {
  params: {
    username: string
  }
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'capitalize',
  minWidth: 100,
  fontWeight: theme.typography.fontWeightMedium,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}))

const AnimatedToggleButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  minWidth: '140px',
  height: '50px',
  fontWeight: theme.typography.fontWeightMedium,
  transition: 'all 0.3s ease-in-out',
  background: 'linear-gradient(45deg, #9c27b0 30%, #d81b60 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #7b1fa2 30%, #c2185b 90%)',
  }
}))

export default function Profile({ params }: ProfileProps) {
  const { user: currentUser } = useAuth()
  const [challengeTab, setChallengeTab] = useState(0) // Current challenge tab
  const [usersTab, setUsersTab] = useState(0) // Current users tab (friends/requests)
  const [drawerOpen, setDrawerOpen] = useState(false) // Side drawer state
  const [viewMode, setViewMode] = useState<'challenges' | 'friends'>('challenges') // Current view mode
  const [challengeSearch, setChallengeSearch] = useState('') // Search for challenges
  const [userSearch, setUserSearch] = useState('') // Search for users
  const [userSortConfig, setUserSortConfig] = useState<UserSortConfig>({ field: 'none', direction: 'desc' })
  const [userFilterType, setUserFilterType] = useState<UserFilterType>('friends')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userChallenges, setUserChallenges] = useState({
    active: [] as typeof mockChallenges,
    pending: [] as typeof mockChallenges,
    completed: [] as typeof mockChallenges,
    created: [] as typeof mockChallenges,
    favorites: [] as typeof mockChallenges,
    received: [] as typeof mockChallenges
  })
  const [userFriends, setUserFriends] = useState<User[]>([])
  const [friendRequests, setFriendRequests] = useState<{ sent: FriendRequest[]; received: FriendRequest[] }>({ sent: [], received: [] })
  const [isLoadingFriends, setIsLoadingFriends] = useState(false)

  const isCurrentUser = user?.id === currentUser?.id

  // Load user data
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true)
      
      // Find user by username
      const foundUser = Object.values(mockUsers).find(u => u.username === params.username)
      
      if (!foundUser) {
        notFound()
        return
      }
      
      setUser(foundUser)
      
      // Get current data from localStorage if this is the current user
      let currentUserData = foundUser
      if (foundUser.id === currentUser?.id && currentUser) {
        // Use current data from useAuth, casting to mock user type
        currentUserData = {
          ...foundUser,
          ...currentUser,
          avatarUrl: currentUser.avatarUrl || '/images/avatars/default.svg'
        }
      }
      
      // Filter user challenges
      const challenges = {
        active: mockChallenges.filter(c => currentUserData?.activeChallenges?.includes(c.id) || false),
        pending: mockChallenges.filter(c => (currentUserData as any)?.pendingChallenges?.includes(c.id) || false),
        completed: mockChallenges.filter(c => currentUserData?.completedChallenges?.includes(c.id) || false),
        created: mockChallenges.filter(c => c.creatorId === currentUserData?.id),
        favorites: mockChallenges.filter(c => (currentUserData as any)?.favoritesChallenges?.includes(c.id) || false),
        received: mockChallenges.filter(c => (currentUserData as any)?.receivedChallenges?.includes(c.id) || false)
      }
      
      setUserChallenges(challenges)
      
      // Load friends data if this is current user or if we want to show their friends
      if (currentUserData?.id) {
        setIsLoadingFriends(true)
        try {
          const [friendsData, requestsData] = await Promise.all([
            friendsApi.getFriends(currentUserData.id),
            friendsApi.getPendingRequests(currentUserData.id)
          ])
          setUserFriends(friendsData)
          setFriendRequests(requestsData)
        } catch (error) {
          console.error('Error loading friends data:', error)
        } finally {
          setIsLoadingFriends(false)
        }
      }
      
      setIsLoading(false)
    }

    loadProfileData()
    
    // Listen for changes for current user
    const handleUserUpdate = () => {
      loadProfileData()
    }
    
    const handleChallengeReceived = () => {
      loadProfileData()
    }
    
    window.addEventListener('userUpdated', handleUserUpdate)
    window.addEventListener('challengeReceived', handleChallengeReceived)
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate)
      window.removeEventListener('challengeReceived', handleChallengeReceived)
    }
  }, [params.username])

  // Handle friend request actions
  const handleAcceptFriendRequest = async (requestId: string) => {
    if (!currentUser) return
    
    try {
      const result = await friendsApi.acceptFriendRequest(requestId, currentUser.id)
      if (result.success) {
        // Reload friends data
        const [friendsData, requestsData] = await Promise.all([
          friendsApi.getFriends(currentUser.id),
          friendsApi.getPendingRequests(currentUser.id)
        ])
        setUserFriends(friendsData)
        setFriendRequests(requestsData)
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const handleRejectFriendRequest = async (requestId: string) => {
    if (!currentUser) return
    
    try {
      const result = await friendsApi.rejectFriendRequest(requestId, currentUser.id)
      if (result.success) {
        // Reload requests data
        const requestsData = await friendsApi.getPendingRequests(currentUser.id)
        setFriendRequests(requestsData)
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!currentUser) return
    
    try {
      const result = await friendsApi.removeFriend(currentUser.id, friendId)
      if (result.success) {
        // Reload friends data
        const friendsData = await friendsApi.getFriends(currentUser.id)
        setUserFriends(friendsData)
        return Promise.resolve()
      } else {
        throw new Error(result.message || 'Failed to remove friend')
      }
    } catch (error) {
      console.error('Error removing friend:', error)
      return Promise.reject(error)
    }
  }

  const handleChallengeTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setChallengeTab(newValue)
  }

  const handleUsersTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setUsersTab(newValue)
  }

  const handleToggleViewMode = () => {
    setViewMode(viewMode === 'challenges' ? 'friends' : 'challenges')
  }

  const handleChangeProfilePicture = () => {
    console.log('Change profile picture')
    // TODO: Implement profile picture change
    setDrawerOpen(false)
  }

  const handleChangeFullName = () => {
    console.log('Change full name')
    // TODO: Implement full name change
    setDrawerOpen(false)
  }

  const handleChangeUsername = () => {
    console.log('Change username')
    // TODO: Implement username change
    setDrawerOpen(false)
  }

  const getFilteredUsers = () => {
    let users: User[] = []
    
    switch (usersTab) {
      case 0: // Friends
        users = userFriends
        break
      case 1: // Friend Requests
        users = friendRequests.received.map(req => {
          const sender = Object.values(mockUsers).find(u => u.id === req.senderId)
          return sender
        }).filter(Boolean) as User[]
        break
      default:
        users = []
    }
    
    if (userSearch) {
      users = users.filter(user => 
        user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(userSearch.toLowerCase())
      )
    }
    
    // Sort users
    if (userSortConfig.field !== 'none') {
      users.sort((a, b) => {
        const multiplier = userSortConfig.direction === 'desc' ? -1 : 1;
        
        switch (userSortConfig.field) {
          case 'points':
            return (a.points - b.points) * multiplier
          case 'completedChallenges':
            return ((a.completedChallenges?.length || 0) - (b.completedChallenges?.length || 0)) * multiplier
          default:
            return 0
        }
      })
    }
    
    return users
  }

  // Function to get active challenges based on tab
  const getActiveTabChallenges = () => {
    const challenges = (() => {
      switch (challengeTab) {
        case 0: return userChallenges.active
        case 1: return userChallenges.pending
        case 2: return userChallenges.completed
        case 3: return userChallenges.created
        case 4: return userChallenges.favorites
        case 5: return userChallenges.received
        default: return []
      }
    })()

    // Filter by search
    if (challengeSearch) {
      return challenges.filter(challenge => 
        challenge.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
        challenge.description.toLowerCase().includes(challengeSearch.toLowerCase())
      )
    }

    return challenges
  }

  // Create skeleton array for loading display
  const skeletonCards = createSkeletonArray(6, ChallengeCardSkeleton).map((skeleton, index) => (
    <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
      {skeleton}
    </Grid>
  ))

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ borderRadius: 4, p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Avatar sx={{ width: 100, height: 100 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                Loading...
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Grid container spacing={3}>
          {skeletonCards}
        </Grid>
      </Container>
    )
  }

  if (!user) {
    return null
  }

  const activeTabChallenges = getActiveTabChallenges()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Menu Button */}
      <Paper sx={{ borderRadius: 4, p: 3, mb: 4, position: 'relative' }}>
        {/* Menu Button in top-left corner */}
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            size="large"
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Add Friend button for non-current users */}
        {!isCurrentUser && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                background: 'linear-gradient(45deg, #9c27b0 30%, #d81b60 90%)',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: '100px'
              }}
            >
              Add Friend
            </Button>
          </Box>
        )}

        {/* Main Content Area */}
        <Box sx={{ pt: 6 }}>
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder={viewMode === 'challenges' ? 'Search challenges...' : 'Search users...'}
              value={viewMode === 'challenges' ? challengeSearch : userSearch}
              onChange={(e) => viewMode === 'challenges' ? setChallengeSearch(e.target.value) : setUserSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  backgroundColor: 'background.paper',
                }
              }}
            />
          </Box>

          {/* Animated Content Container */}
          <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '60px' }}>
            {/* Challenges View */}
            <Slide direction="right" in={viewMode === 'challenges'} mountOnEnter unmountOnExit>
              <Box sx={{ position: viewMode === 'challenges' ? 'static' : 'absolute', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {/* Challenge Tabs */}
                  <Box sx={{ flex: 1 }}>
                    <Tabs 
                      value={challengeTab} 
                      onChange={handleChallengeTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: 'primary.main',
                        }
                      }}
                    >
                      <StyledTab label="Active Challenges" />
                      <StyledTab label="Pending Approval" />
                      <StyledTab label="Completed Challenges" />
                      <StyledTab label="Created Challenges" />
                      <StyledTab label="Favorites" />
                      <StyledTab label="Received Challenges" />
                    </Tabs>
                  </Box>
                  
                  {/* Toggle Button */}
                  <AnimatedToggleButton
                    onClick={handleToggleViewMode}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Friends
                  </AnimatedToggleButton>
                </Box>
              </Box>
            </Slide>

            {/* Friends View */}
            <Slide direction="left" in={viewMode === 'friends'} mountOnEnter unmountOnExit>
              <Box sx={{ position: viewMode === 'friends' ? 'static' : 'absolute', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {/* Toggle Button */}
                  <AnimatedToggleButton
                    onClick={handleToggleViewMode}
                    startIcon={<ArrowBackIcon />}
                  >
                    Challenges
                  </AnimatedToggleButton>

                  {/* User Filters */}
                  <Box sx={{ flex: 1 }}>
                    <UsersFilters
                      searchQuery={userSearch}
                      setSearchQuery={setUserSearch}
                      filterType={userFilterType}
                      setFilterType={setUserFilterType}
                      sortConfig={userSortConfig}
                      setSortConfig={setUserSortConfig}
                      hideFilterSelect={true}
                    />
                  </Box>
                  
                  {/* Friends Tabs */}
                  <Box>
                    <Tabs 
                      value={usersTab} 
                      onChange={handleUsersTabChange}
                      sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: 'primary.main',
                        }
                      }}
                    >
                      <Tab 
                        label={`FRIENDS (${userFriends.length})`}
                        data-testid="friends-tab"
                      />
                      <Tab 
                        label={`REQUESTS (${friendRequests.received.length})`}
                        data-testid="friend-requests-tab"
                      />
                    </Tabs>
                  </Box>
                </Box>
              </Box>
            </Slide>
          </Box>
        </Box>
      </Paper>

      {/* Content Area */}
      {viewMode === 'challenges' ? (
        /* Challenges Content */
        <Box>
          <Grid container spacing={3}>
            {activeTabChallenges.map(challenge => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <ChallengeCard challenge={challenge} />
              </Grid>
            ))}
          </Grid>

          {/* Message when no challenges found */}
          {activeTabChallenges.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                mt: 4
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No challenges found
              </Typography>
              <Typography color="text.secondary">
                {challengeTab === 0 && 'No active challenges at the moment.'}
                {challengeTab === 1 && 'No challenges pending approval.'}
                {challengeTab === 2 && 'No completed challenges yet.'}
                {challengeTab === 3 && 'No created challenges yet.'}
                {challengeTab === 4 && 'No favorite challenges yet.'}
                {challengeTab === 5 && 'No received challenges yet.'}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        /* Friends Content */
        <Box>
          {isLoadingFriends ? (
            <Stack spacing={2}>
              {createSkeletonArray(3, UserCardSkeleton)}
            </Stack>
          ) : (
            <Stack spacing={2}>
              {getFilteredUsers().map(user => (
                <Box key={user.id}>
                  {usersTab === 1 ? ( // Friend Requests tab
                    <UserCard 
                      user={user} 
                      onChatClick={() => {}} // Disable chat for pending requests
                      showFriendRequestActions={true}
                      onAcceptFriend={() => {
                        const request = friendRequests.received.find(r => r.senderId === user.id)
                        if (request) handleAcceptFriendRequest(request.id)
                      }}
                      onRejectFriend={() => {
                        const request = friendRequests.received.find(r => r.senderId === user.id)
                        if (request) handleRejectFriendRequest(request.id)
                      }}
                    />
                  ) : ( // Friends tab
                    <UserCard 
                      user={user} 
                      onChatClick={() => {
                        // TODO: Navigate to messages or open chat
                        console.log(`Starting chat with ${user.username}`)
                      }}
                      onRemoveFriend={() => handleRemoveFriend(user.id)}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          )}
          
          {!isLoadingFriends && getFilteredUsers().length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                mt: 4
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {usersTab === 0 ? 'No friends' : 'No friend requests'}
              </Typography>
              <Typography color="text.secondary">
                {usersTab === 0 
                  ? 'Start getting to know other users on the "Users" page.'
                  : 'You have no new friend requests.'
                }
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Side Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        {/* Close Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            src={user.avatarUrl || '/images/avatars/default.svg'}
            alt={user.username}
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2,
              border: '4px solid rgba(255,255,255,0.3)'
            }}
          />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            {user.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
            {user.fullName}
          </Typography>
          <Chip
            icon={<EmojiEventsIcon />}
            label={`${user.points} points`}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        {/* Edit Options for Current User */}
        {isCurrentUser && (
          <>
            <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <Stack spacing={1} sx={{ mb: 4 }}>
              <Button
                fullWidth
                startIcon={<PhotoCameraIcon />}
                onClick={handleChangeProfilePicture}
                sx={{ 
                  color: 'white', 
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Change Profile Picture
              </Button>
              <Button
                fullWidth
                startIcon={<PersonIcon />}
                onClick={handleChangeFullName}
                sx={{ 
                  color: 'white', 
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Edit Full Name
              </Button>
              <Button
                fullWidth
                startIcon={<EditIcon />}
                onClick={handleChangeUsername}
                sx={{ 
                  color: 'white', 
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Edit Username
              </Button>
            </Stack>
          </>
        )}

        {/* Statistics */}
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Statistics
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GroupIcon />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Active</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userChallenges.active.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmojiEventsIcon />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Completed</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userChallenges.completed.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CreateIcon />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Created</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userChallenges.created.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BookmarkIcon />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Favorites</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userChallenges.favorites.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SendIcon />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Received</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userChallenges.received.length}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Drawer>
    </Container>
  )
} 