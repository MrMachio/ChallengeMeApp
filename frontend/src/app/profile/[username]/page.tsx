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
import { mockChallenges } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'
import { createSkeletonArray } from '@/lib/utils'
import { friendsApi, notificationsApi } from '@/lib/api/friends'
import type { User, FriendRequest } from '@/lib/api/friends'
// Временно отключаем RTK Query, так как эндпоинт не реализован
// import { useGetUserByUsernameQuery } from '@/lib/store/api/usersApi'
import UsersFilters from '@/components/UsersFilters'
import type { UserSortConfig, UserSortField, UserFilterType } from '@/app/users/page'
import { TextFieldStyled } from '@/components/Filters/styledWrappers'

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
  borderRadius: '16px',
  minWidth: '100px',
  height: '36px',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'lowercase',
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
  const [isLoading, setIsLoading] = useState(true)

  // Временное решение: показываем профиль только для текущего пользователя
  // TODO: когда будет реализован GET /users/username/{username}, убрать эту проверку
  const user = currentUser && currentUser.username === params.username ? currentUser : null
  const error = !user && !isLoading ? { status: 404 } : null

  const isCurrentUser = user?.id === currentUser?.id

  // Simulate loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Handle user not found
  if (error && 'status' in error && error.status === 404) {
    notFound()
  }

  // Load user challenges and friends data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return
      
      // Filter user challenges - using mock data for now
      const challenges = {
        active: mockChallenges.filter(c => user.activeChallenges?.includes(c.id) || false),
        pending: mockChallenges.filter(c => user.pendingChallenges?.includes(c.id) || false),
        completed: mockChallenges.filter(c => user.completedChallenges?.includes(c.id) || false),
        created: mockChallenges.filter(c => c.creatorId === user.id),
        favorites: mockChallenges.filter(c => user.favoritesChallenges?.includes(c.id) || false),
        received: [] // TODO: Add receivedChallenges field to User type
      }
      
      setUserChallenges(challenges)
      
      // Load friends data
      if (user.id) {
        setIsLoadingFriends(true)
        try {
          const [friendsData, requestsData] = await Promise.all([
            friendsApi.getFriends(user.id),
            friendsApi.getPendingRequests(user.id)
          ])
          setUserFriends(friendsData)
          setFriendRequests(requestsData)
        } catch (error) {
          console.error('Error loading friends data:', error)
          // Устанавливаем пустые данные в случае ошибки
          setUserFriends([])
          setFriendRequests({ sent: [], received: [] })
        } finally {
          setIsLoadingFriends(false)
        }
      }
    }

    loadProfileData()
    
    // Listen for changes
    const handleUserUpdate = () => {
      loadProfileData()
    }
    
    const handleChallengeReceived = () => {
      loadProfileData()
    }
    
    window.addEventListener('userUpdated', handleUserUpdate)
    window.addEventListener('challengeReceived', handleChallengeReceived)
    window.addEventListener('challengeStatusChanged', (e: any) => {
      handleChallengeStatusChange(e.detail.challengeId, e.detail.newStatus)
    })
    window.addEventListener('challengeFavoriteToggled', (e: any) => {
      handleToggleFavorite(e.detail.challengeId, e.detail.isFavorite)
    })
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate)
      window.removeEventListener('challengeReceived', handleChallengeReceived)
      window.removeEventListener('challengeStatusChanged', (e: any) => {
        handleChallengeStatusChange(e.detail.challengeId, e.detail.newStatus)
      })
      window.removeEventListener('challengeFavoriteToggled', (e: any) => {
        handleToggleFavorite(e.detail.challengeId, e.detail.isFavorite)
      })
    }
  }, [user, currentUser])

  // Handle friend request actions
  const handleAcceptFriendRequest = async (requestId: string) => {
    if (!currentUser) return
    
    try {
      const result = await friendsApi.acceptFriendRequest(requestId, currentUser.id)
      if (result.success) {
        // Update state locally without reloading
        const acceptedRequest = friendRequests.received.find(r => r.id === requestId)
        if (acceptedRequest) {
          // TODO: когда будет API для получения пользователей, заменить на реальный запрос
          // const newFriend = await usersApi.getUserById(acceptedRequest.senderId)
          console.log('Friend request accepted, but user data fetching not implemented yet')
          
          // Пока просто убираем запрос из списка
          setFriendRequests(prev => ({
            ...prev,
            received: prev.received.filter(r => r.id !== requestId)
          }))
        }
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
        // Update state locally without reloading
        setFriendRequests(prev => ({
          ...prev,
          received: prev.received.filter(r => r.id !== requestId)
        }))
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
        // Update state locally without reloading
        setUserFriends(prev => prev.filter(friend => friend.id !== friendId))
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

  // Handle challenge status changes without page reload
  const handleChallengeStatusChange = (challengeId: string, newStatus: string) => {
    setUserChallenges(prev => {
      const newChallenges = { ...prev }
      
      // Remove from all categories
      Object.keys(newChallenges).forEach(key => {
        newChallenges[key as keyof typeof newChallenges] = newChallenges[key as keyof typeof newChallenges].filter(c => c.id !== challengeId)
      })
      
      // Add to new category
      const challenge = mockChallenges.find(c => c.id === challengeId)
      if (challenge) {
        switch (newStatus) {
          case 'active':
            newChallenges.active.push(challenge)
            break
          case 'completed':
            newChallenges.completed.push(challenge)
            break
          case 'pending':
            newChallenges.pending.push(challenge)
            break
        }
      }
      
      return newChallenges
    })
  }

  // Handle favorites toggle without page reload
  const handleToggleFavorite = (challengeId: string, isFavorite: boolean) => {
    setUserChallenges(prev => {
      const challenge = mockChallenges.find(c => c.id === challengeId)
      if (!challenge) return prev
      
      const newChallenges = { ...prev }
      
      if (isFavorite) {
        // Add to favorites if not already there
        if (!newChallenges.favorites.some(c => c.id === challengeId)) {
          newChallenges.favorites.push(challenge)
        }
      } else {
        // Remove from favorites
        newChallenges.favorites = newChallenges.favorites.filter(c => c.id !== challengeId)
      }
      
      return newChallenges
    })
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
        // TODO: когда будет API для получения пользователей, заменить на реальные запросы
        users = friendRequests.received.map(req => {
          // Временное решение: создаем фиктивного пользователя
          return {
            id: req.senderId,
            username: `user_${req.senderId.slice(0, 8)}`,
            email: `user_${req.senderId.slice(0, 8)}@example.com`,
            fullName: `User ${req.senderId.slice(0, 8)}`,
            avatarUrl: '/images/avatars/default.svg',
            points: 0,
            completedChallenges: [],
            activeChallenges: [],
            createdChallenges: [],
            pendingChallenges: [],
            favoritesChallenges: [],
            receivedChallenges: [],
            friends: [],
            friendRequests: { sent: [], received: [] },
            followers: 0,
            following: 0,
            lastSeen: new Date().toISOString(),
            isOnline: false,
          } as User
        })
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
        {/* Header Skeleton */}
        <Paper sx={{ borderRadius: 4, p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 6 }}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'grey.300' }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ 
                height: 20, 
                bgcolor: 'grey.300', 
                borderRadius: 1, 
                mb: 0.5, 
                width: '120px' 
              }} />
              <Box sx={{ 
                height: 16, 
                bgcolor: 'grey.200', 
                borderRadius: 1, 
                mb: 1, 
                width: '100px' 
              }} />
              <Box sx={{ 
                height: 24, 
                bgcolor: 'warning.light', 
                borderRadius: '12px', 
                width: '80px' 
              }} />
            </Box>
          </Box>
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <Box sx={{ width: 48, height: 48, bgcolor: 'grey.300', borderRadius: '50%' }} />
          </Box>
        </Paper>

        {/* Tabs Skeleton */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ height: '56px', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <Box sx={{ minWidth: 300, height: 40, bgcolor: 'grey.300', borderRadius: '20px' }} />
              <Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Box key={i} sx={{ 
                    height: 32, 
                    width: 80, 
                    bgcolor: 'grey.300', 
                    borderRadius: 1 
                  }} />
                ))}
              </Box>
              <Box sx={{ width: 100, height: 36, bgcolor: 'primary.light', borderRadius: '18px' }} />
            </Box>
          </Box>
        </Box>

        {/* Content Skeleton */}
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
      {/* Header with User Info and Menu Button */}
      <Paper 
        sx={{ 
          borderRadius: 4, 
          p: 3, 
          position: 'relative',
          '& > *:not(:last-child)': {
            zIndex: 0
          }
        }}
      >
        {/* User Info on left */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2.5, 
            pr: 6,
            position: 'relative',
            zIndex: 0
          }}
        >
          <Avatar
            src={user.avatarUrl || '/images/avatars/default.svg'}
            alt={user.username}
            sx={{ 
              width: 80, 
              height: 80,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '1.8rem',
                lineHeight: 1.2,
                mb: 1.5
              }}
            >
              {user.username}
            </Typography>
            {user.fullName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    lineHeight: 1.2,
                  }}
                >
                  {user.fullName}
                </Typography>
                <Chip
                  icon={<EmojiEventsIcon sx={{ fontSize: '14px' }} />}
                  label={`${user.points} points`}
                  sx={{
                    bgcolor: '#F59E0B',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    height: '24px',
                    px: 1.5,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
            )}
            {!user.fullName && (
              <Chip
                icon={<EmojiEventsIcon sx={{ fontSize: '14px' }} />}
                label={`${user.points} points`}
                sx={{
                  bgcolor: '#F59E0B',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  height: '24px',
                  px: 1.5,
                  width: 'fit-content',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            )}
          </Box>
        </Box>

        {/* Menu Button in top-right corner */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
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
            data-testid="profile-menu-button"
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
      </Paper>

      {/* Tabs Section */}
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Animated Content Container */}
        <Box sx={{ 
          position: 'relative', 
          overflow: 'hidden', 
          height: '56px', 
          zIndex: 1
        }}>
          {/* Challenges View */}
          <Slide direction="right" in={viewMode === 'challenges'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              position: viewMode === 'challenges' ? 'static' : 'absolute', 
              width: '100%', 
              height: '56px',
              top: 0, 
              left: 0,
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              overflow: 'visible'
            }}>
                {/* Search Bar for Challenges */}
                <Box sx={{ minWidth: 300 }}>
                  <TextFieldStyled
                    placeholder="Search challenges..."
                    size="small"
                    value={challengeSearch}
                    onChange={(e) => setChallengeSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: challengeSearch ? (
                        <InputAdornment 
                          position="end" 
                          onClick={() => setChallengeSearch('')}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              '& .MuiSvgIcon-root': {
                                color: 'text.primary'
                              }
                            }
                          }}
                        >
                          <CloseIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ) : null
                    }}
                    data-testid="challenges-search-bar"
                  />
                </Box>

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
                    <StyledTab label="Active" />
                    <StyledTab label="Pending" />
                    <StyledTab label="Completed" />
                    <StyledTab label="Created" />
                    <StyledTab label="Favorites" />
                    <StyledTab label="Received" />
                  </Tabs>
                </Box>
                
                {/* Toggle Button */}
                <AnimatedToggleButton
                  size="small"
                  onClick={handleToggleViewMode}
                  endIcon={<ArrowForwardIcon />}
                >
                  friends
                </AnimatedToggleButton>
            </Box>
          </Slide>

          {/* Friends View */}
          <Slide direction="left" in={viewMode === 'friends'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              position: viewMode === 'friends' ? 'static' : 'absolute', 
              width: '100%', 
              height: '56px',
              top: 0, 
              left: 0,
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              overflow: 'visible'
            }}>
                {/* Toggle Button */}
                <AnimatedToggleButton
                  size="small"
                  onClick={handleToggleViewMode}
                  startIcon={<ArrowBackIcon />}
                >
                  challenges
                </AnimatedToggleButton>

                {/* User Filters */}
                <Box sx={{ 
                  flex: 1, 
                  minWidth: 0, 
                  zIndex: 2,
                  position: 'relative',
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10px',
                    left: 0,
                    right: 0,
                    height: '10px',
                    zIndex: -1
                  }
                }}>
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
          </Slide>
        </Box>
      </Box>

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
                {challengeTab === 0 && 'No active items at the moment.'}
                {challengeTab === 1 && 'No items pending approval.'}
                {challengeTab === 2 && 'No completed items yet.'}
                {challengeTab === 3 && 'No created items yet.'}
                {challengeTab === 4 && 'No favorite items yet.'}
                {challengeTab === 5 && 'No received items yet.'}
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
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 455,
            p: 3,
            backgroundColor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {/* Close Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
          <Avatar
            src={user.avatarUrl || '/images/avatars/default.svg'}
            alt={user.username}
            sx={{ 
              width: 90, 
              height: 90,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '2rem',
                lineHeight: 1.2,
                mb: 2
              }}
            >
              {user.username}
            </Typography>
            {user.fullName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    lineHeight: 1.2,
                  }}
                >
                  {user.fullName}
                </Typography>
                <Chip
                  icon={<EmojiEventsIcon sx={{ fontSize: '18px' }} />}
                  label={`${user.points} points`}
                  sx={{
                    bgcolor: '#F59E0B',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    height: '32px',
                    px: 2,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
            )}
            {!user.fullName && (
              <Chip
                icon={<EmojiEventsIcon sx={{ fontSize: '18px' }} />}
                label={`${user.points} points`}
                sx={{
                  bgcolor: '#F59E0B',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  height: '32px',
                  px: 2,
                  width: 'fit-content',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            )}
          </Box>
        </Box>

        {/* Edit Options for Current User */}
        {isCurrentUser && (
          <>
            <Divider sx={{ my: 3 }} />
            <Stack spacing={2} sx={{ mb: 5 }}>
              <Button
                fullWidth
                startIcon={<PhotoCameraIcon sx={{ fontSize: '1.8rem' }} />}
                onClick={handleChangeProfilePicture}
                sx={{ 
                  color: 'text.primary', 
                  justifyContent: 'flex-start',
                  fontSize: '1.3rem',
                  py: 1.25,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                Change Profile Picture
              </Button>
              <Button
                fullWidth
                startIcon={<PersonIcon sx={{ fontSize: '1.8rem' }} />}
                onClick={handleChangeFullName}
                sx={{ 
                  color: 'text.primary', 
                  justifyContent: 'flex-start',
                  fontSize: '1.3rem',
                  py: 1.25,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                Edit Full Name
              </Button>
              <Button
                fullWidth
                startIcon={<EditIcon sx={{ fontSize: '1.8rem' }} />}
                onClick={handleChangeUsername}
                sx={{ 
                  color: 'text.primary', 
                  justifyContent: 'flex-start',
                  fontSize: '1.3rem',
                  py: 1.25,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                Edit Username
              </Button>
            </Stack>
          </>
        )}

        {/* Statistics */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary', fontSize: '1.5rem' }}>
          Statistics
        </Typography>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <GroupIcon sx={{ fontSize: '1.8rem' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.3rem' }}>Active:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '1.3rem' }}>
                {userChallenges.active.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <EmojiEventsIcon sx={{ fontSize: '1.8rem' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.3rem' }}>Completed:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '1.3rem' }}>
                {userChallenges.completed.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <CreateIcon sx={{ fontSize: '1.8rem' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.3rem' }}>Created:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '1.3rem' }}>
                {userChallenges.created.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <BookmarkIcon sx={{ fontSize: '1.8rem' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.3rem' }}>Favorites:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '1.3rem' }}>
                {userChallenges.favorites.length}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <SendIcon sx={{ fontSize: '1.8rem' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.3rem' }}>Received:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '1.3rem' }}>
                {userChallenges.received.length}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Drawer>
    </Container>
  )
} 