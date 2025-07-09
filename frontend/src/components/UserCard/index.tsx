'use client'

import { useState, useEffect } from 'react'
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
  Paper,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '@/lib/providers/AuthProvider'
import { friendsApi } from '@/lib/api/friends'

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
    isOnline?: boolean;
    lastSeen?: string;
  };
  onChatClick?: (userId: string) => void;
  showFriendRequestActions?: boolean; // Show accept/reject buttons for friend requests
  onAcceptFriend?: () => void; // Callback for accepting friend request
  onRejectFriend?: () => void; // Callback for rejecting friend request
  onRemoveFriend?: () => Promise<void>; // Callback for removing friend - returns promise
}

export function UserCardSkeleton() {
  return (
    <Card sx={{ 
      width: '100%', 
      mb: 2,
      borderRadius: '20px',
      border: 1,
      borderColor: 'divider'
    }}>
      <CardContent sx={{ p: 1.5, position: 'relative', minHeight: '80px' }}>
        {/* Top Right Skeleton */}
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8
        }}>
          <Skeleton variant="rounded" width={70} height={28} sx={{ borderRadius: '14px' }} />
        </Box>

        {/* Main Content - Left aligned */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 8 }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" height={22} />
          </Box>
        </Box>

        {/* Bottom Right Skeleton */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 8, 
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Skeleton variant="rounded" width={50} height={20} sx={{ borderRadius: '10px' }} />
          <Skeleton variant="rounded" width={80} height={20} sx={{ borderRadius: '10px' }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default function UserCard({ 
  user, 
  onChatClick, 
  showFriendRequestActions = false,
  onAcceptFriend,
  onRejectFriend,
  onRemoveFriend
}: UserCardProps) {
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'friends' | 'pending' | 'received'>('none')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { user: currentUser } = useAuth()

  // Load friendship status only if not showing friend request actions
  useEffect(() => {
    if (showFriendRequestActions) {
      setFriendshipStatus('received') // For friend request actions, it's always a received request
      return
    }
    
    const loadFriendshipStatus = async () => {
      if (!currentUser) return
      
      try {
        const status = await friendsApi.getFriendshipStatus(currentUser.id, user.id)
        setFriendshipStatus(status)
      } catch (error) {
        console.error('Error loading friendship status:', error)
      }
    }

    loadFriendshipStatus()
  }, [currentUser, user.id, showFriendRequestActions])

  // Reset delete confirmation when friendship status changes
  useEffect(() => {
    setShowDeleteConfirm(false)
  }, [friendshipStatus])

  // Auto-hide delete confirmation after 5 seconds if user doesn't click
  useEffect(() => {
    if (showDeleteConfirm) {
      const timer = setTimeout(() => {
        setShowDeleteConfirm(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showDeleteConfirm])

  const handleFriendAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUser) return

    if (showFriendRequestActions) {
      // Handle friend request actions
      return // Actions are handled by parent component
    }

    setIsLoading(true)
    
    try {
      if (friendshipStatus === 'none') {
        // Send friend request
        const result = await friendsApi.sendFriendRequest(currentUser.id, user.id)
        if (result.success) {
          setFriendshipStatus('pending')
        }
      } else if (friendshipStatus === 'received') {
        // Accept friend request
        const pendingRequests = await friendsApi.getPendingRequests(currentUser.id)
        const request = pendingRequests.received.find(r => r.senderId === user.id)
        if (request) {
          const result = await friendsApi.acceptFriendRequest(request.id, currentUser.id)
          if (result.success) {
            setFriendshipStatus('friends')
          }
        }
      }
    } catch (error) {
      console.error('Error handling friend action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onChatClick) {
      onChatClick(user.id)
    }
  }

  const handleRemoveFriend = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (showDeleteConfirm) {
      // User confirmed deletion
      setIsLoading(true)
      try {
        if (onRemoveFriend) {
          await onRemoveFriend()
          // Update local state after successful removal
          setFriendshipStatus('none')
        }
        setShowDeleteConfirm(false)
      } catch (error) {
        console.error('Error removing friend:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Show confirmation
      setShowDeleteConfirm(true)
    }
  }

  const handleCardClick = () => {
    // Navigate to chat on card click
    if (onChatClick) {
      onChatClick(user.id)
    }
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on profile elements
    e.stopPropagation()
  }

  const getFriendButtonContent = () => {
    if (showFriendRequestActions) {
      return { icon: <PersonAddIcon fontSize="small" />, text: 'Accept', color: 'primary' as const }
    }
    
    switch (friendshipStatus) {
      case 'friends':
        return { icon: <CheckIcon fontSize="small" />, text: 'Friends', color: 'success' as const }
      case 'pending':
        return { icon: <PersonAddDisabledIcon fontSize="small" />, text: 'Sent', color: 'secondary' as const }
      case 'received':
        return { icon: <PersonAddIcon fontSize="small" />, text: 'Accept', color: 'primary' as const }
      default:
        return { icon: <PersonAddIcon fontSize="small" />, text: 'Add Friend', color: 'primary' as const }
    }
  }

  const friendButtonContent = getFriendButtonContent()

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '20px', // Much more rounded like filters
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 3,
          borderColor: 'primary.main',
          transform: 'translateY(-1px)',
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 1.5, position: 'relative', minHeight: '80px' }}>
        {/* Top Right - Friend Actions */}
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          zIndex: 2
        }}>
          {showFriendRequestActions ? (
            // Friend request actions
            <>
              <Button
                size="small"
                variant="contained"
                startIcon={<CheckIcon fontSize="small" />}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAcceptFriend?.()
                }}
                disabled={isLoading}
                color="primary"
                sx={{ 
                  minWidth: 'auto',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  px: 2
                }}
              >
                Accept
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CloseIcon fontSize="small" />}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRejectFriend?.()
                }}
                disabled={isLoading}
                color="error"
                sx={{ 
                  minWidth: 'auto',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  px: 2
                }}
              >
                Reject
              </Button>
            </>
          ) : (
            // Normal user actions
            <>
              {friendshipStatus !== 'friends' && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={friendButtonContent.icon}
                  onClick={handleFriendAction}
                  disabled={isLoading}
                  color={friendButtonContent.color}
                  sx={{ 
                    minWidth: 'auto',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    px: 2,
                    fontWeight: 500,
                    textTransform: 'lowercase',
                    '&:hover': {
                      backgroundColor: `${friendButtonContent.color}.main`,
                      color: 'white'
                    }
                  }}
                >
                  {friendButtonContent.text}
                </Button>
              )}
              
              {friendshipStatus === 'friends' && (
                showDeleteConfirm ? (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleRemoveFriend}
                    disabled={isLoading}
                    color="error"
                    sx={{ 
                      borderRadius: '16px',
                      fontSize: '0.75rem',
                      px: 2,
                      textTransform: 'lowercase'
                    }}
                  >
                    delete
                  </Button>
                ) : (
                  <IconButton
                    size="small"
                    onClick={handleRemoveFriend}
                    sx={{ 
                      width: '24px',
                      height: '24px',
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'error.dark'
                      }
                    }}
                    title="Remove friend"
                  >
                    <CloseIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                )
              )}
            </>
          )}
        </Box>

        {/* Main Content - Left aligned */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 8 }}>
          {/* Avatar - Clickable to profile */}
          <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
            <Avatar
              src={user.avatarUrl || '/images/avatars/default.svg'}
              alt={user.username}
              onClick={handleProfileClick}
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

          {/* User Info - Center Left */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Username - Clickable to profile */}
            <Box sx={{ display: 'flex', mb: 0.25 }}>
              <Typography
                variant="h6"
                component={Link}
                href={`/profile/${user.username}`}
                onClick={handleProfileClick}
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  textDecoration: 'none',
                  width: 'fit-content',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                {user.username}
              </Typography>
            </Box>

            {/* Full Name - Clickable to profile */}
            {user.fullName && (
              <Box sx={{ display: 'flex' }}>
                <Typography 
                  variant="body2" 
                  component={Link}
                  href={`/profile/${user.username}`}
                  color="text.secondary"
                  onClick={handleProfileClick}
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    width: 'fit-content',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {user.fullName}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Bottom Right - Points and Completed */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 8, 
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 2
        }}>
          {/* Points */}
          <Chip
            icon={<EmojiEventsIcon sx={{ fontSize: '14px' }} />}
            label={user.points}
            size="small"
            sx={{
              bgcolor: '#F59E0B',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 500,
              height: '20px',
              borderRadius: '10px',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
          
          {/* Completed Challenges */}
          <Chip
            label={`${user.completedChallenges.length} completed`}
            size="small"
            variant="outlined"
            sx={{ 
              height: '20px',
              fontSize: '0.7rem',
              borderRadius: '10px',
              color: 'text.secondary',
              borderColor: 'divider'
            }}
          />
        </Box>
      </CardContent>
    </Paper>
  )
} 