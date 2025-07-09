'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Box, 
  Typography, 
  Rating, 
  Avatar, 
  Button, 
  Chip, 
  Card,
  CardContent,
  CardMedia,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PendingIcon from '@mui/icons-material/Pending'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { formatDistanceToNow } from 'date-fns'
import { recalculateRating } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'

const CompletionCard = styled(Card)(({ theme }) => ({
  minWidth: '320px',
  maxWidth: '320px',
  height: '400px',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
  }
}))

const MediaContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '180px',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
})

const StatusChip = styled(Chip)<{ status: 'pending' | 'approved' | 'rejected' }>(({ theme, status }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  zIndex: 1,
  backgroundColor: 
    status === 'approved' ? theme.palette.success.main :
    status === 'rejected' ? theme.palette.error.main :
    theme.palette.warning.main,
  color: 'white',
  fontWeight: 600,
  height: '20px',
  fontSize: '10px',
  '& .MuiChip-icon': {
    color: 'white',
    fontSize: '14px'
  }
}))

const CreatorActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1)
}))

const ScrollContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: '8px',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#a8a8a8',
  },
})

interface CompletedUser {
  id: string
  userId: string
  username: string
  avatarUrl: string | null
  rating: number
  userRatings: Record<string, number>
  likes: number
  dislikes: number
  proofUrl: string
  proofType: 'image' | 'video'
  description: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  completedAt: string
}

interface CompletedUsersListProps {
  users: CompletedUser[]
  challengeCreatorId: string
  onApprove?: (completionId: string) => void
  onReject?: (completionId: string) => void
  onRate?: (completionId: string, rating: number) => void
  onLike?: (completionId: string) => void
  onDislike?: (completionId: string) => void
}

export default function CompletedUsersList({ 
  users, 
  challengeCreatorId, 
  onApprove, 
  onReject, 
  onRate
}: CompletedUsersListProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [localRatings, setLocalRatings] = useState<Record<string, { userRatings: Record<string, number>, averageRating: number }>>({})
  
  // Get current user
  const { user: currentUser } = useAuth()

  const isCreator = currentUser?.id === challengeCreatorId
  
  // Drag to scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMediaClick = (url: string, type: 'image' | 'video') => {
    setSelectedMedia(url)
    setMediaType(type)
  }

  const handleCloseMedia = () => {
    setSelectedMedia(null)
  }

  const handleRating = (completionId: string, rating: number) => {
    if (!currentUser) return;
    
    // Find the user being rated
    const userBeingRated = users.find(u => u.id === completionId)
    if (userBeingRated) {
      // Update local state for immediate UI feedback
      const currentUserRatings = { ...userBeingRated.userRatings }
      currentUserRatings[currentUser.id] = rating
      const newAverageRating = recalculateRating(currentUserRatings)
      
      setLocalRatings(prev => ({
        ...prev,
        [completionId]: {
          userRatings: currentUserRatings,
          averageRating: newAverageRating
        }
      }))
    }
    
    onRate?.(completionId, rating)
  }

  const getStatusIcon = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon />
      case 'rejected':
        return <CancelIcon />
      case 'pending':
        return <PendingIcon />
    }
  }

  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'pending':
        return 'Pending'
    }
  }

  if (users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No completions yet. Be the first to complete this challenge!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <ScrollContainer 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        sx={{
          userSelect: isDragging ? 'none' : 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {users.map((user) => {
          // Use local rating if available, otherwise use original
          const localRating = localRatings[user.id]
          const displayRating = localRating ? localRating.averageRating : user.rating
          const displayUserRatings = localRating ? localRating.userRatings : user.userRatings
          
          return (
            <CompletionCard key={user.id}>
              <Box sx={{ position: 'relative' }}>
                <StatusChip
                  status={user.status}
                  icon={getStatusIcon(user.status)}
                  label={getStatusText(user.status)}
                  size="small"
                />
                <MediaContainer onClick={() => handleMediaClick(user.proofUrl, user.proofType)}>
                  {user.proofType === 'image' ? (
                    <Image
                      src={user.proofUrl}
                      alt={`${user.username}'s proof`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 0.5
                    }}>
                      <PlayArrowIcon sx={{ fontSize: 40, color: 'rgba(0,0,0,0.6)' }} />
                      <Typography variant="caption" color="text.secondary">
                        Video
                      </Typography>
                    </Box>
                  )}
                </MediaContainer>
              </Box>
              
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                {/* User Info */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <Avatar
                    src={user.avatarUrl || '/images/avatars/default.svg'}
                    alt={user.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, fontSize: '14px' }} noWrap>
                        {user.username}
                      </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }} noWrap>
                      {user.rating.toFixed(1)} ⭐
                    </Typography>
                  </Box>
                </Stack>

                {/* Description */}
                <Box sx={{ 
                  mb: 1.5, 
                  height: '80px', 
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '2px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '2px',
                  }
                }}>
                  <Typography variant="body2" sx={{ fontSize: '13px', lineHeight: 1.4, color: 'text.secondary' }}>
                    {user.description}
                  </Typography>
                </Box>

                {/* Community Rating - Only show if user is not the author */}
                {user.status === 'approved' && currentUser && user.userId !== currentUser.id && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', fontWeight: 500 }}>
                      Rate:
                    </Typography>
                    <Rating
                      value={displayUserRatings[currentUser.id] || 0}
                      onChange={(_, value) => handleRating(user.id, value || 0)}
                      size="large"
                      sx={{ 
                        fontSize: '24px',
                        '& .MuiRating-iconFilled': {
                          color: '#FFD700',
                        },
                        '& .MuiRating-iconEmpty': {
                          color: '#E0E0E0',
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Creator Actions */}
                {isCreator && user.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => onApprove?.(user.id)}
                      fullWidth
                      sx={{ 
                        fontSize: '12px', 
                        px: 2, 
                        py: 1, 
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        background: '#4CAF50',
                        '&:hover': {
                          background: '#45a049',
                        }
                      }}
                    >
                      Approve Challenge
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onReject?.(user.id)}
                      fullWidth
                      sx={{ 
                        fontSize: '12px', 
                        px: 2, 
                        py: 1, 
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        background: '#f44336',
                        '&:hover': {
                          background: '#d32f2f',
                        }
                      }}
                    >
                      Reject Challenge
                    </Button>
                  </Box>
                )}
              </CardContent>
            </CompletionCard>
          )
        })}
      </ScrollContainer>

      {/* Media Preview Dialog */}
      <Dialog
        open={!!selectedMedia}
        onClose={handleCloseMedia}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          Proof of Completion
        </DialogTitle>
        <DialogContent>
          {selectedMedia && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {mediaType === 'image' ? (
                <Image
                  src={selectedMedia}
                  alt="Proof of completion"
                  width={600}
                  height={400}
                  style={{ objectFit: 'contain', borderRadius: 8 }}
                />
              ) : (
                <video
                  src={selectedMedia}
                  controls
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px',
                    borderRadius: 8
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMedia}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
} 