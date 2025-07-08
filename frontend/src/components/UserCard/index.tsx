'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Skeleton,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SendIcon from '@mui/icons-material/Send'
import ChatIcon from '@mui/icons-material/Chat'
import { useAuth } from '@/lib/providers/AuthProvider'

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}))

export interface UserCardProps {
  user: {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl: string;
    points: number;
    completedChallenges: string[];
  }
}

export function UserCardSkeleton() {
  return (
    <Card sx={{ width: '100%', mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function UserCard({ user }: UserCardProps) {
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const { user: currentUser } = useAuth()

  const handleAddFriend = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUser) return

    setIsAddingFriend(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Implement actual friend adding logic
    console.log(`Adding ${user.username} as friend`)
    
    setIsAddingFriend(false)
  }

  const handleSendChallenge = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement send challenge logic
    console.log(`Sending challenge to ${user.username}`)
  }

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement messaging logic
    console.log(`Messaging ${user.username}`)
  }

  return (
    <StyledCard data-testid={`user-card-${user.username}`}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Avatar */}
          <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
            <Avatar
              src={user.avatarUrl || '/images/avatars/default.svg'}
              alt={user.username}
              sx={{ 
                width: 60, 
                height: 60,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Link>

          {/* User Info */}
          <Box sx={{ flex: 1 }}>
            <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                {user.username}
              </Typography>
            </Link>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
              {user.fullName && (
                <Typography variant="body2" color="text.secondary">
                  {user.fullName}
                </Typography>
              )}
              <Chip
                icon={<EmojiEventsIcon sx={{ fontSize: '1rem' }} />}
                label={`${user.points} points`}
                size="small"
                variant="outlined"
                sx={{ 
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.75rem'
                  }
                }}
              />
              <Chip
                label={`${user.completedChallenges.length} completed`}
                size="small"
                variant="outlined"
                sx={{ 
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={handleAddFriend}
              disabled={isAddingFriend}
              color="primary"
              sx={{ 
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              <PersonAddIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleSendChallenge}
              color="primary"
              sx={{ 
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMessage}
              color="primary"
              sx={{ 
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              <ChatIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </CardContent>
    </StyledCard>
  )
} 