'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Box, 
  Typography, 
  Rating, 
  IconButton, 
  Avatar, 
  Button, 
  Chip, 
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PendingIcon from '@mui/icons-material/Pending'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { formatDistanceToNow } from 'date-fns'
import { recalculateRating } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'

const CompletionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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
  height: '300px',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
})

const StatusChip = styled(Chip)<{ status: 'pending' | 'approved' | 'rejected' }>(({ theme, status }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 1,
  backgroundColor: 
    status === 'approved' ? theme.palette.success.main :
    status === 'rejected' ? theme.palette.error.main :
    theme.palette.warning.main,
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-icon': {
    color: 'white'
  }
}))

const CreatorActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2)
}))

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
  onRate, 
  onLike, 
  onDislike 
}: CompletedUsersListProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [localRatings, setLocalRatings] = useState<Record<string, { userRatings: Record<string, number>, averageRating: number }>>({})
  
  // Получаем текущего пользователя
  const { user: currentUser } = useAuth()

  const isCreator = currentUser?.id === challengeCreatorId

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
        return 'Pending Review'
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
                  gap: 1
                }}>
                  <PlayArrowIcon sx={{ fontSize: 60, color: 'rgba(0,0,0,0.6)' }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to play video
                  </Typography>
                </Box>
              )}
            </MediaContainer>
          </Box>
          
          <CardContent>
            {/* User Info */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar
                src={user.avatarUrl || '/images/avatars/default.svg'}
                alt={user.username}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                  Submitted {formatDistanceToNow(new Date(user.submittedAt), { addSuffix: true })}
                </Typography>
              </Box>
            </Stack>

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {user.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Rating and Actions */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                          {/* Community Rating - Only show if user is not the author */}
            {user.status === 'approved' && currentUser && user.userId !== currentUser.id && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Rate this completion:
                </Typography>
                <Rating
                  value={displayUserRatings[currentUser.id] || 0}
                  onChange={(_, value) => handleRating(user.id, value || 0)}
                  size="small"
                />
              </Box>
            )}

              {/* Current Rating */}
              {user.status === 'approved' && displayRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Average:
                  </Typography>
                  <Rating value={displayRating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({displayRating.toFixed(1)} from {Object.keys(displayUserRatings).length} votes)
                  </Typography>
                </Box>
              )}

              {/* Like/Dislike */}
              {user.status === 'approved' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => onLike?.(user.id)}
                    color="primary"
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {user.likes}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => onDislike?.(user.id)}
                    color="secondary"
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {user.dislikes}
                  </Typography>
                </Box>
              )}
            </Stack>

            {/* Creator Actions */}
            {isCreator && user.status === 'pending' && (
              <CreatorActions>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => onApprove?.(user.id)}
                  size="small"
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => onReject?.(user.id)}
                  size="small"
                >
                  Reject
                </Button>
              </CreatorActions>
            )}
          </CardContent>
        </CompletionCard>
        )
      })}

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