'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Stack,
  Rating,
  TextField,
  Alert,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { formatDistanceToNow } from 'date-fns'
import CompletedUsersList from '../CompletedUsersList'
import { mockCompletions, mockChallengeLikes, mockUsers, recalculateRating } from '@/lib/mock/data'
import { useChallengeStatus } from '@/lib/hooks/useChallengeStatus'
import { useAuth } from '@/lib/hooks/useAuth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '900px',
    width: '900px',
    height: '1000px',
    maxHeight: '1000px',
    margin: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(5px)'
  }
}))

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '300px',
  backgroundColor: '#f5f5f5'
})

const HeaderChips = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 1
}))

const FooterDetails = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1
}))

const DetailChip = styled(Chip)(({ theme }) => ({
  height: '28px',
  '& .MuiChip-label': {
    fontWeight: 500,
    fontSize: '0.875rem',
    padding: '0 12px'
  }
}))

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ChallengeModalProps {
  open: boolean
  onClose: () => void
  challenge: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    points: number
    imageUrl: string | null
    creatorId: string
    creator: {
      username: string
      avatarUrl: string | null
    }
    createdAt: string
    likesCount: number
    completionsCount: number
  }
}

export default function ChallengeModal({ open, onClose, challenge }: ChallengeModalProps) {
  // Используем новый хук для управления статусом задания
  const { status: challengeStatus, loading: statusLoading, updateStatus } = useChallengeStatus(challenge.id)
  // Получаем текущего пользователя
  const { user: currentUser } = useAuth()
  
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showProofUpload, setShowProofUpload] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [proofDescription, setProofDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get completions for this challenge
  const completedUsers = mockCompletions[challenge.id] || [];

  // Обновляем состояние лайков
  const updateLikes = () => {
    const likes = mockChallengeLikes[challenge.id] || [];
    const userLiked = currentUser ? likes.includes(currentUser.id) : false;
    setIsLiked(userLiked);
    setLikesCount(likes.length);
  }

  useEffect(() => {
    if (open) {
      updateLikes();
      setShowProofUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setProofDescription('');
    }
  }, [open, challenge.id]);

  const handleLike = () => {
    if (!currentUser) return;
    
    // Уменьшаем задержку до 100-200мс
    setTimeout(() => {
      const likes = mockChallengeLikes[challenge.id] || [];
      if (!isLiked) {
        mockChallengeLikes[challenge.id] = [...likes, currentUser.id];
      } else {
        mockChallengeLikes[challenge.id] = likes.filter(id => id !== currentUser.id);
      }
      updateLikes(); // Обновляем состояние сразу после изменения
    }, Math.random() * 100 + 100);
  }

  const handleAcceptChallenge = async () => {
    try {
      await updateStatus('accept');
    } catch (error) {
      console.error('Failed to accept challenge:', error);
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Создаем URL для превью
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  const handleSubmitProof = async () => {
    if (!selectedFile || !proofDescription.trim()) return;

    try {
      // Создаем URL для файла
      const proofUrl = URL.createObjectURL(selectedFile);
      
      await updateStatus('submit_proof', {
        proofUrl,
        description: proofDescription
      });

      // Обновляем UI
      setShowProofUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setProofDescription('');

      // Закрываем модальное окно
      onClose();
    } catch (error) {
      console.error('Failed to submit proof:', error);
    }
  }

  const handleCancelChallenge = () => {
    // TODO: Implement API call to cancel challenge
  }

  // Handler functions for completion management
  const handleApproveCompletion = async (completionId: string) => {
    const completion = mockCompletions[challenge.id]?.find(c => c.id === completionId)
    if (completion) {
      completion.status = 'approved'
      completion.completedAt = new Date().toISOString()
      
      // Move user from pending to completed challenges
      const user = mockUsers[completion.userId]
      if (user) {
        user.pendingChallenges = user.pendingChallenges.filter((id: string) => id !== challenge.id.toString())
        if (!user.completedChallenges.includes(challenge.id.toString())) {
          user.completedChallenges.push(challenge.id.toString())
          
          // Add points to user for completing the challenge
          const challengePoints = challenge.points || 0
          user.points += challengePoints
        }
      }
      
      // Update localStorage if it's current user
      if (currentUser && completion.userId === currentUser.id) {
        try {
          await updateStatus('approve')
        } catch (error) {
          console.error('Failed to approve completion:', error)
        }
      }
    }
  }

  const handleRejectCompletion = async (completionId: string) => {
    const completion = mockCompletions[challenge.id]?.find(c => c.id === completionId)
    if (completion) {
      completion.status = 'rejected'
      
      // Move user from pending back to active challenges
      const user = mockUsers[completion.userId]
      if (user) {
        user.pendingChallenges = user.pendingChallenges.filter((id: string) => id !== challenge.id.toString())
        if (!user.activeChallenges.includes(challenge.id.toString())) {
          user.activeChallenges.push(challenge.id.toString())
        }
      }
      
      // Update localStorage if it's current user
      if (currentUser && completion.userId === currentUser.id) {
        try {
          await updateStatus('reject')
        } catch (error) {
          console.error('Failed to reject completion:', error)
        }
      }
    }
  }

  const handleRateCompletion = (completionId: string, rating: number) => {
    if (!currentUser) return;
    
    const completion = mockCompletions[challenge.id]?.find(c => c.id === completionId)
    if (completion && completion.status === 'approved') {
      // Prevent user from rating their own completion
      if (completion.userId === currentUser.id) {
        return
      }
      
      // Add or update the user's rating
      completion.userRatings[currentUser.id] = rating
      
      // Calculate new average rating using helper function
      completion.rating = recalculateRating(completion.userRatings)
    }
  }

  const handleLikeCompletion = (completionId: string) => {
    const completion = mockCompletions[challenge.id]?.find(c => c.id === completionId)
    if (completion && completion.status === 'approved') {
      completion.likes += 1
    }
  }

  const handleDislikeCompletion = (completionId: string) => {
    const completion = mockCompletions[challenge.id]?.find(c => c.id === completionId)
    if (completion && completion.status === 'approved') {
      completion.dislikes += 1
    }
  }

  // Добавляем функцию для определения цветов сложности
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy':
        return { bg: '#E8F5E9', color: '#2E7D32' }
      case 'medium':
        return { bg: '#FFF3E0', color: '#E65100' }
      case 'hard':
        return { bg: '#FFEBEE', color: '#C62828' }
      default:
        return { bg: '#E8F5E9', color: '#2E7D32' }
    }
  }

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
          zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.4)',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.6)'
          }
        }}
      >
        <CloseIcon />
      </IconButton>

      <ImageContainer>
        <FooterDetails>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <DetailChip 
              label={challenge.category}
              sx={{
                bgcolor: 'white',
                color: 'text.primary'
              }}
            />
            <DetailChip 
              label={challenge.difficulty}
              sx={({ palette }) => {
                const colors = getDifficultyColor(challenge.difficulty);
                return {
                  bgcolor: colors.bg,
                  color: colors.color
                };
              }}
            />
          </Box>
          <DetailChip 
            label={`${challenge.points} points`}
            sx={{
              bgcolor: 'warning.main',
              color: 'white'
            }}
          />
        </FooterDetails>
        {challenge.imageUrl ? (
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100'
            }}
          >
            <Typography color="text.secondary">No image</Typography>
          </Box>
        )}
      </ImageContainer>

      <DialogContent sx={{ 
        p: 3, 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
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
      }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {challenge.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                onClick={handleLike}
                sx={{
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '40px'
                }}
              >
                {likesCount}
              </Typography>
              <IconButton 
                onClick={() => setIsBookmarked(!isBookmarked)}
                sx={{
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </Stack>
          </Box>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {challenge.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={challenge.creator.avatarUrl || '/images/avatars/default.svg'}
              alt={challenge.creator.username}
            />
            <Box>
              <Typography variant="subtitle2">
                {challenge.creator.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Секция действий */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {/* Not accepted and not completed/pending */}
          {challengeStatus?.status === 'none' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAcceptChallenge}
              disabled={statusLoading}
              sx={{
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Accept Challenge
            </Button>
          )}

          {/* Accepted (in active challenges) */}
          {challengeStatus?.status === 'active' && !showProofUpload && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setShowProofUpload(true)}
              sx={{
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Submit Proof
            </Button>
          )}

          {/* Pending approval */}
          {challengeStatus?.status === 'pending' && (
            <Chip
              label="Pending Approval"
              color="warning"
              icon={<AccessTimeIcon />}
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                height: '48px',
                px: 2
              }}
            />
          )}

          {/* Completed */}
          {challengeStatus?.status === 'completed' && (
            <Chip
              label="Completed"
              color="success"
              icon={<CheckCircleIcon />}
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                height: '48px',
                px: 2
              }}
            />
          )}
        </Box>

        {/* Секция загрузки доказательства */}
        {showProofUpload && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Submit Your Proof
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ alignSelf: 'center' }}
              >
                Upload Photo/Video
                <VisuallyHiddenInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
              </Button>

              {previewUrl && (
                <Box sx={{ width: '100%', maxWidth: 400, mb: 2, alignSelf: 'center' }}>
                  {selectedFile?.type.startsWith('image/') ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Image
                        src={previewUrl}
                        alt="Proof preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      style={{ width: '100%', maxHeight: 200, borderRadius: 8 }}
                    />
                  )}
                </Box>
              )}

              <TextField
                label="Describe how you completed this challenge"
                multiline
                rows={4}
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                placeholder="Tell us about your experience, what you learned, and how you completed this challenge..."
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                disabled={!selectedFile || !proofDescription.trim()}
                onClick={handleSubmitProof}
                sx={{
                  borderRadius: '100px',
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  alignSelf: 'center'
                }}
              >
                Confirm Submission
              </Button>
            </Box>
          </Box>
        )}

        {/* Список выполнивших */}
        {completedUsers.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Submissions ({completedUsers.length})
            </Typography>
            <CompletedUsersList 
              users={completedUsers} 
              challengeCreatorId={challenge.creatorId}
              onApprove={handleApproveCompletion}
              onReject={handleRejectCompletion}
              onRate={handleRateCompletion}
              onLike={handleLikeCompletion}
              onDislike={handleDislikeCompletion}
            />
          </Box>
        )}
      </DialogContent>
    </StyledDialog>
  )
} 