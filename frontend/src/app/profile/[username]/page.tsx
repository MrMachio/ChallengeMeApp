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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import ChallengeCard, { ChallengeCardSkeleton } from '@/components/ChallengeCard'
import { mockUsers, mockChallenges } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'

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

export default function Profile({ params }: ProfileProps) {
  const { user: currentUser } = useAuth()
  const [mainTab, setMainTab] = useState(1) // 0 for Users, 1 for Challenges
  const [usersTab, setUsersTab] = useState(0) // Sub-tabs for users (0: Friends, 1: All Users)
  const [challengeTab, setChallengeTab] = useState(0) // Sub-tabs for challenges
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null)
  const [userSearch, setUserSearch] = useState('')
  const [userSort, setUserSort] = useState('points') // points, name, challenges
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userChallenges, setUserChallenges] = useState({
    active: [] as typeof mockChallenges,
    pending: [] as typeof mockChallenges,
    completed: [] as typeof mockChallenges,
    created: [] as typeof mockChallenges,
    favorites: [] as typeof mockChallenges
  })
  const [userFriends, setUserFriends] = useState<any[]>([]) // Mock friends data

  const isCurrentUser = user?.id === currentUser?.id

  // Загружаем данные пользователя
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true)
      
      // Ищем пользователя по username
      const foundUser = Object.values(mockUsers).find(u => u.username === params.username)
      
      if (!foundUser) {
        notFound()
        return
      }
      
      setUser(foundUser)
      
      // Получаем актуальные данные из localStorage если это текущий пользователь
      let currentUserData = foundUser
      if (foundUser.id === currentUser?.id && currentUser) {
        // Используем актуальные данные из useAuth, приводя к типу mock user
        currentUserData = {
          ...foundUser,
          ...currentUser,
          avatarUrl: currentUser.avatarUrl || '/images/avatars/default.svg'
        }
      }
      
      // Фильтруем челленджи пользователя
      const challenges = {
        active: mockChallenges.filter(c => currentUserData?.activeChallenges?.includes(c.id) || false),
        pending: mockChallenges.filter(c => (currentUserData as any)?.pendingChallenges?.includes(c.id) || false),
        completed: mockChallenges.filter(c => currentUserData?.completedChallenges?.includes(c.id) || false),
        created: mockChallenges.filter(c => c.creatorId === currentUserData?.id),
        favorites: mockChallenges.filter(c => (currentUserData as any)?.favoritesChallenges?.includes(c.id) || false)
      }
      
      setUserChallenges(challenges)
      
      // Mock friends data - в реальном приложении это будет загружаться с API
      const friends = Object.values(mockUsers).filter(u => u.id !== currentUserData.id).slice(0, 5)
      setUserFriends(friends)
      
      setIsLoading(false)
    }

    loadProfileData()
    
    // Слушаем изменения для текущего пользователя
    const handleUserUpdate = () => {
      loadProfileData()
    }
    
    window.addEventListener('userUpdated', handleUserUpdate)
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate)
    }
  }, [params.username])

  const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMainTab(newValue)
  }

  const handleChallengeTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setChallengeTab(newValue)
  }

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchor(event.currentTarget)
  }

  const handleSettingsClose = () => {
    setSettingsAnchor(null)
  }

  const handleUsersTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setUsersTab(newValue)
  }

  const handleChangeProfilePicture = () => {
    console.log('Change profile picture')
    // TODO: Implement profile picture change
    setSettingsAnchor(null)
  }

  const handleChangeFullName = () => {
    console.log('Change full name')
    // TODO: Implement full name change
    setSettingsAnchor(null)
  }

  const handleChangeUsername = () => {
    console.log('Change username')
    // TODO: Implement username change
    setSettingsAnchor(null)
  }

  const getFilteredUsers = () => {
    const allUsers = Object.values(mockUsers).filter(u => u.id !== user.id)
    let users = usersTab === 0 ? userFriends : allUsers
    
    if (userSearch) {
      users = users.filter(user => 
        user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(userSearch.toLowerCase())
      )
    }
    
    // Sort users
    users.sort((a, b) => {
      switch (userSort) {
        case 'points':
          return b.points - a.points
        case 'name':
          return (a.fullName || a.username).localeCompare(b.fullName || b.username)
        case 'challenges':
          return (b.completedChallenges?.length || 0) - (a.completedChallenges?.length || 0)
        default:
          return 0
      }
    })
    
    return users
  }

  // Создаем массив скелетонов для отображения во время загрузки
  const skeletonCards = Array.from({ length: 6 }, (_, index) => (
    <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
      <ChallengeCardSkeleton />
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

  // Функция для получения активных заданий в зависимости от таба
  const getActiveTabChallenges = () => {
    switch (challengeTab) {
      case 0: return userChallenges.active
      case 1: return userChallenges.pending
      case 2: return userChallenges.completed
      case 3: return userChallenges.created
      case 4: return userChallenges.favorites
      default: return []
    }
  }

  const activeTabChallenges = getActiveTabChallenges()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ borderRadius: 4, p: 3, mb: 4, position: 'relative' }}>
        {/* Settings Menu in top-right corner */}
        {isCurrentUser && (
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <IconButton 
              onClick={handleSettingsClick} 
              size="small"
              sx={{ 
                transition: 'transform 0.3s ease',
                transform: settingsAnchor ? 'rotate(90deg)' : 'rotate(0deg)'
              }}
            >
              {settingsAnchor ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={handleSettingsClose}
            >
              <MenuItem onClick={handleChangeProfilePicture}>
                <PhotoCameraIcon sx={{ mr: 2 }} />
                Change Profile Picture
              </MenuItem>
              <MenuItem onClick={handleChangeFullName}>
                <PersonIcon sx={{ mr: 2 }} />
                Edit Full Name
              </MenuItem>
              <MenuItem onClick={handleChangeUsername}>
                <EditIcon sx={{ mr: 2 }} />
                Edit Username
              </MenuItem>
            </Menu>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Avatar, User Info and Navigation Tabs */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
              <Avatar
                src={user.avatarUrl || '/images/avatars/default.svg'}
                alt={user.username}
                sx={{ width: 80, height: 80 }}
              />
              
              {/* Name and Points next to avatar */}
              <Box>
                <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                  {user.username}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {user.fullName}
                  </Typography>
                  <Chip
                    icon={<EmojiEventsIcon />}
                    label={`${user.points} points`}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Box>
            
            {/* Main Navigation Tabs under avatar and user info */}
            <Tabs 
              value={mainTab} 
              onChange={handleMainTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  minHeight: 40,
                  fontSize: '0.875rem',
                  px: 2
                }
              }}
            >
              <StyledTab label="Users" />
              <StyledTab label="Challenges" />
            </Tabs>
          </Box>
          
          <Box sx={{ flex: 1 }}>

            {/* Add Friend button for non-current users */}
            {!isCurrentUser && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
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
          </Box>

          {/* Stats column - moved more to the left */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', mr: 8 }}>
            <Chip
              icon={<GroupIcon />}
              label={`${userChallenges.active.length} active`}
              size="medium"
              color="primary"
              variant="outlined"
              sx={{ width: 160 }}
            />
            <Chip
              icon={<EmojiEventsIcon />}
              label={`${userChallenges.completed.length} completed`}
              size="medium"
              color="success"
              variant="outlined"
              sx={{ width: 160 }}
            />
            <Chip
              icon={<CreateIcon />}
              label={`${userChallenges.created.length} created`}
              size="medium"
              color="info"
              variant="outlined"
              sx={{ width: 160 }}
            />
            <Chip
              icon={<BookmarkIcon />}
              label={`${userChallenges.favorites.length} favorites`}
              size="medium"
              sx={{ 
                width: 160,
                color: '#FFD700',
                borderColor: '#FFD700',
                '& .MuiChip-icon': {
                  color: '#FFD700'
                }
              }}
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>

      {/* Content based on main tab */}
      {mainTab === 0 ? (
        /* Users Tab */
        <Box>
          {/* Users Sub-tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={usersTab} 
              onChange={handleUsersTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                }
              }}
            >
              <Tab label="Friends" />
              <Tab label="All Users" />
            </Tabs>
          </Box>

          {/* Search and Sort Controls */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={userSort}
                onChange={(e) => setUserSort(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="points">By points</MenuItem>
                <MenuItem value="name">By name</MenuItem>
                <MenuItem value="challenges">By challenges</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Users Grid */}
          <Grid container spacing={3}>
            {getFilteredUsers().map(user => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                  <Avatar
                    src={user.avatarUrl || '/images/avatars/default.svg'}
                    alt={user.username}
                    sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {user.fullName}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip
                      label={`${user.points} pts`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                    <Chip
                      label={`${user.completedChallenges?.length || 0} completed`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          {getFilteredUsers().length === 0 && (
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
                {usersTab === 0 ? 'No friends' : 'No users found'}
              </Typography>
              <Typography color="text.secondary">
                {usersTab === 0 
                  ? 'Start connecting with other users.'
                  : 'Try changing search parameters.'
                }
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        /* Challenges Tab */
        <Box>
          {/* Challenge Sub-tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={challengeTab} 
              onChange={handleChallengeTabChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
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
            </Tabs>
          </Box>

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
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Container>
  )
} 