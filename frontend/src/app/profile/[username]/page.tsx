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
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupIcon from '@mui/icons-material/Group'
import CreateIcon from '@mui/icons-material/Create'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
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
  const [activeTab, setActiveTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userChallenges, setUserChallenges] = useState({
    active: [] as typeof mockChallenges,
    pending: [] as typeof mockChallenges,
    completed: [] as typeof mockChallenges,
    created: [] as typeof mockChallenges
  })

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
        created: mockChallenges.filter(c => c.creatorId === currentUserData?.id)
      }
      
      setUserChallenges(challenges)
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
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
    switch (activeTab) {
      case 0: return userChallenges.active
      case 1: return userChallenges.pending
      case 2: return userChallenges.completed
      case 3: return userChallenges.created
      default: return []
    }
  }

  const activeTabChallenges = getActiveTabChallenges()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ borderRadius: 4, p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Avatar
            src={user.avatarUrl || '/images/avatars/default.svg'}
            alt={user.username}
            sx={{ width: 100, height: 100 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                  {user.username}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    icon={<EmojiEventsIcon />}
                    label={`${user.points} points`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                  {user.fullName && (
                    <Typography variant="body1" color="text.secondary">
                      {user.fullName}
                    </Typography>
                  )}
                </Stack>
              </Box>
              
              {!isCurrentUser && (
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
              )}
            </Box>

            <Stack direction="row" spacing={4}>
              <Chip
                icon={<GroupIcon />}
                label={`${userChallenges.active.length} active`}
                size="small"
                color="primary"
                variant="outlined"
              />
              {(user as any).pendingChallenges && (user as any).pendingChallenges.length > 0 && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${userChallenges.pending.length} pending`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
              <Chip
                icon={<EmojiEventsIcon />}
                label={`${userChallenges.completed.length} completed`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<CreateIcon />}
                label={`${userChallenges.created.length} created`}
                size="small"
                color="info"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
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
            {activeTab === 0 && 'No active challenges at the moment.'}
            {activeTab === 1 && 'No challenges pending approval.'}
            {activeTab === 2 && 'No completed challenges yet.'}
            {activeTab === 3 && 'No created challenges yet.'}
          </Typography>
        </Box>
      )}
    </Container>
  )
} 