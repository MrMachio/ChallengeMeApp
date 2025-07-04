'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Chip,
  Stack,
  Grid,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PersonIcon from '@mui/icons-material/Person'
import ChallengeCard from '../ChallengeCard'
import { mockUsers, mockChallenges } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '1000px',
    width: '100%',
    margin: theme.spacing(2),
    borderRadius: '16px',
  },
}))

interface UserProfileModalProps {
  open: boolean
  onClose: () => void
}

export default function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [friendSearch, setFriendSearch] = useState('')
  const { user } = useAuth()

  if (!user) return null

  // Получаем челленджи пользователя
  const userChallenges = {
    active: mockChallenges.filter(c => user.activeChallenges.includes(c.id)),
    completed: mockChallenges.filter(c => user.completedChallenges.includes(c.id)),
    created: mockChallenges.filter(c => c.creatorId === user.id)
  }

  // Фильтруем друзей по поиску
  const friends = Object.values(mockUsers)
    .filter(u => u.id !== user.id)
    .filter(u => 
      friendSearch === '' || 
      u.username.toLowerCase().includes(friendSearch.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(friendSearch.toLowerCase())
    )

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <Box sx={{ position: 'relative', bgcolor: 'background.paper' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
            color: 'white',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={user.avatarUrl}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5">{user.username}</Typography>
              <Typography variant="body1">{user.fullName}</Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h6">{user.points}</Typography>
              <Typography variant="body2">Points</Typography>
            </Box>
            <Box>
              <Typography variant="h6">{userChallenges.completed.length}</Typography>
              <Typography variant="body2">Completed</Typography>
            </Box>
            <Box>
              <Typography variant="h6">{userChallenges.active.length}</Typography>
              <Typography variant="body2">Active</Typography>
            </Box>
            <Box>
              <Typography variant="h6">{userChallenges.created.length}</Typography>
              <Typography variant="body2">Created</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Active Challenges" />
            <Tab label="Completed Challenges" />
            <Tab label="Created Challenges" />
            <Tab label="Friends" />
          </Tabs>
        </Box>

        {/* Challenges Tabs Content */}
        <DialogContent>
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {userChallenges.active.map(challenge => (
                <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                  <ChallengeCard challenge={challenge} />
                </Grid>
              ))}
              {userChallenges.active.length === 0 && (
                <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                  <Typography color="text.secondary">No active challenges</Typography>
                </Box>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {userChallenges.completed.map(challenge => (
                <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                  <ChallengeCard challenge={challenge} />
                </Grid>
              ))}
              {userChallenges.completed.length === 0 && (
                <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                  <Typography color="text.secondary">No completed challenges</Typography>
                </Box>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              {userChallenges.created.map(challenge => (
                <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                  <ChallengeCard challenge={challenge} />
                </Grid>
              ))}
              {userChallenges.created.length === 0 && (
                <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                  <Typography color="text.secondary">No created challenges</Typography>
                </Box>
              )}
            </Grid>
          </TabPanel>

          {/* Friends Tab Content */}
          <TabPanel value={activeTab} index={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search friends..."
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <List>
              {friends.map((friend) => (
                <ListItem
                  key={friend.id}
                  secondaryAction={
                    <Button variant="outlined" size="small">
                      View Profile
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={friend.avatarUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.username}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span">
                          {friend.fullName}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={`Level ${Math.floor(friend.points / 100)}`}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </DialogContent>
      </Box>
    </StyledDialog>
  )
} 