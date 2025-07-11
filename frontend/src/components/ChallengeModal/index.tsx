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
import { challengesApi } from '@/lib/api/challenges'
import { getDifficultyColor, formatTimeAgo } from '@/lib/utils'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'
import ReplyIcon from '@mui/icons-material/Reply'

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

interface Comment {
  id: string
  userId: string
  username: string
  avatarUrl: string | null
  content: string
  createdAt: string
  replies: Comment[]
}

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
  // Generate initial comments based on challenge age and popularity
  const generateInitialComments = (challengeId: string): Comment[] => {
    // For new challenges (created recently), return empty array
    const now = new Date()
    const challengeCreated = new Date(challenge.createdAt)
    const hoursSinceCreated = (now.getTime() - challengeCreated.getTime()) / (1000 * 60 * 60)
    
    // If challenge is less than 1 hour old, no comments yet
    if (hoursSinceCreated < 1) {
      return []
    }
    
    // For older challenges, generate some sample comments based on ID
    const sampleComments: Comment[] = [
      {
        id: `comment-${challengeId}-1`,
        userId: 'user4',
        username: 'Sarah Chen',
        avatarUrl: '/images/avatars/user4.jpg',
        content: 'This looks like a great challenge! Looking forward to participating.',
        createdAt: new Date(challengeCreated.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours after creation
        replies: []
      },
      {
        id: `comment-${challengeId}-2`,
        userId: 'user3',
        username: 'Mike Johnson', 
        avatarUrl: '/images/avatars/user3.jpg',
        content: 'Thanks for creating this! Exactly what I needed.',
        createdAt: new Date(challengeCreated.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours after creation
        replies: []
      }
    ]
    
    // Return different number of comments based on challenge popularity
    if (challenge.likesCount > 10) {
      return sampleComments
    } else if (challenge.likesCount > 5) {
      return [sampleComments[0]]
    } else {
      return []
    }
  }
  // Use new hook for challenge status management
  const { status: challengeStatus, loading: statusLoading, updateStatus } = useChallengeStatus(challenge.id)
  // Get current user
  const { user: currentUser } = useAuth()
  
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [showProofUpload, setShowProofUpload] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [proofDescription, setProofDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>(() => generateInitialComments(challenge.id))
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

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
      // Загружаем статус избранного
      loadBookmarkStatus();
      setShowProofUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setProofDescription('');
    }
  }, [open, challenge.id, challenge.likesCount]);

  // Additional effect to update likes and bookmarks when challenge data changes
  useEffect(() => {
    if (open) {
      updateLikes();
      loadBookmarkStatus();
    }
  }, [challenge.likesCount, currentUser?.favoritesChallenges]);

  const loadBookmarkStatus = async () => {
    if (!currentUser) return;
    
    try {
      const response = await challengesApi.getFavoriteStatus(challenge.id);
      if (!response.error) {
        setIsBookmarked(response.data.isFavorite);
      }
    } catch (error) {
      console.error('Failed to load bookmark status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser || bookmarkLoading) return;
    
    setBookmarkLoading(true);
    
    try {
      const response = await challengesApi.toggleFavorite(challenge.id);
      if (!response.error) {
        setIsBookmarked(response.data.isFavorite);
      } else {
        console.error('Failed to toggle bookmark:', response.error);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleLike = () => {
    if (!currentUser) return;
    
    // Reduce delay to 100-200ms
    setTimeout(() => {
      const likes = mockChallengeLikes[challenge.id] || [];
      if (!isLiked) {
        mockChallengeLikes[challenge.id] = [...likes, currentUser.id];
      } else {
        mockChallengeLikes[challenge.id] = likes.filter(id => id !== currentUser.id);
      }
              updateLikes(); // Update state immediately after change
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
      
      // Определяем тип медиа на основе файла
      const proofType = selectedFile.type.startsWith('video/') ? 'video' : 'image';
      
      await updateStatus('submit_proof', {
        proofUrl,
        description: proofDescription,
        proofType
      });

      // Обновляем UI
      setShowProofUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setProofDescription('');

      // Не закрываем модальное окно, пользователь остается в нем
    } catch (error) {
      console.error('Failed to submit proof:', error);
    }
  }

  const handleCancelChallenge = async () => {
    try {
      // Manually remove challenge from active challenges and return to 'none' state
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const activeChallenges = userData.activeChallenges || [];
        
        // Remove challenge from active challenges
        const updatedActiveChallenges = activeChallenges.filter((id: string) => id !== challenge.id);
        
        userData.activeChallenges = updatedActiveChallenges;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // TODO: Replace with real API call to update user challenges
        // Temporarily commented out mockUsers usage
        
        // Trigger status refetch to update UI
        window.dispatchEvent(new Event('userUpdated'));
      }
      
      setShowProofUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setProofDescription('');
    } catch (error) {
      console.error('Failed to cancel challenge:', error);
    }
  }

  // Comments handlers
  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl || '/images/avatars/default.svg',
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim() || !currentUser) return;
    
    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl || '/images/avatars/default.svg',
      content: replyText,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [reply, ...comment.replies] }
        : comment
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  // Handler functions for completion management
  const handleApproveCompletion = async (completionId: string) => {
    const completion = mockCompletions[challenge.id]?.find(c => c.id === completionId)
    if (completion) {
      completion.status = 'approved'
      completion.completedAt = new Date().toISOString()
      
      // TODO: Replace with real API call to update user challenges
      // Temporarily removed mockUsers usage
      
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
      
      // TODO: Replace with real API call to update user challenges
      // Temporarily removed mockUsers usage
      
      // Update localStorage if it's current user
      if (currentUser && completion.userId === currentUser.id) {
        try {
          // Update local storage to reflect the cancelled state
          const userData = JSON.parse(localStorage.getItem('userData') || '{}')
          userData.pendingChallenges = userData.pendingChallenges?.filter((id: string) => id !== challenge.id.toString()) || []
          userData.activeChallenges = userData.activeChallenges?.filter((id: string) => id !== challenge.id.toString()) || []
          localStorage.setItem('userData', JSON.stringify(userData))
          
          // Trigger status refetch to update UI
          window.dispatchEvent(new Event('userUpdated'))
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



  // Добавляем функцию для определения цветов сложности


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
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                sx={{
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                {isBookmarked ? <BookmarkIcon sx={{ color: '#FFD700' }} /> : <BookmarkBorderIcon />}
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
                {currentUser?.id === challenge.creatorId ? 'you' : challenge.creator.username}
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
              onClick={handleAcceptChallenge}
              disabled={statusLoading}
              fullWidth
              data-testid="accept-challenge-btn"
              sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #1976D2 100%)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Accept Challenge
            </Button>
          )}

          {/* Accepted (in active challenges) */}
          {challengeStatus?.status === 'active' && !showProofUpload && (
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelChallenge}
                disabled={statusLoading}
                data-testid="cancel-challenge-btn"
                sx={{
                  borderRadius: '100px',
                  px: 3,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  flex: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                  },
                }}
              >
                Cancel Challenge
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowProofUpload(true)}
                disabled={statusLoading}
                data-testid="submit-proof-btn"
                sx={{
                  backgroundColor: '#9C27B0',
                  borderRadius: '100px',
                  px: 3,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  flex: 1,
                  '&:hover': {
                    backgroundColor: '#7B1FA2',
                  },
                }}
              >
                Submit Proof
              </Button>
            </Box>
          )}

          {/* Pending approval */}
          {challengeStatus?.status === 'pending' && (
            <Button
              variant="contained"
              color="warning"
              disabled
              fullWidth
              startIcon={<AccessTimeIcon />}
              sx={{
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              Pending Approval
            </Button>
          )}

          {/* Completed */}
          {challengeStatus?.status === 'completed' && (
            <Button
              variant="contained"
              disabled
              fullWidth
              startIcon={<CheckCircleIcon />}
              sx={{
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#4CAF50',
                color: 'white',
                '&.Mui-disabled': {
                  backgroundColor: '#4CAF50',
                  color: 'white',
                }
              }}
            >
              Completed
            </Button>
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
                fullWidth
                sx={{
                  borderRadius: '100px',
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
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
                <Box sx={{ width: '100%', mb: 2 }}>
                  {selectedFile?.type.startsWith('image/') ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid #e0e0e0'
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
                      style={{ 
                        width: '100%', 
                        maxHeight: 200, 
                        borderRadius: 16,
                        border: '2px solid #e0e0e0'
                      }}
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
                fullWidth
                sx={{
                  borderRadius: '100px',
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #1976D2 100%)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  },
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
            />
          </Box>
        )}

        {/* Комментарии */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments ({comments.length})
          </Typography>
          
          {/* Добавить новый комментарий */}
          {currentUser && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  src={currentUser.avatarUrl || '/images/avatars/default.svg'}
                  alt={currentUser.username}
                  sx={{ width: 40, height: 40 }}
                />
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
                    data-testid="comment-input"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': {
                          borderColor: '#6c5ce7',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6c5ce7',
                        },
                      },
                    }}
                  />
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      endIcon={<SendIcon />}
                      data-testid="post-comment-btn"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: '#6c5ce7',
                        '&:hover': {
                          backgroundColor: '#5a4fcf',
                        },
                      }}
                    >
                      Post Comment
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Список комментариев */}
          <Stack spacing={3}>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ position: 'relative' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    src={comment.avatarUrl || '/images/avatars/default.svg'}
                    alt={comment.username}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: 2, 
                      p: 2,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -6,
                        top: 12,
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '6px 6px 6px 0',
                        borderColor: 'transparent #f8f9fa transparent transparent'
                      }
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {comment.username}
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {comment.content}
                      </Typography>
                    </Box>
                    
                    {/* Действия с комментарием */}
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                        size="small"
                        onClick={() => setReplyingTo(comment.id)}
                        startIcon={<ReplyIcon />}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        Reply
                      </Button>
                    </Box>

                    {/* Форма ответа */}
                    {replyingTo === comment.id && currentUser && (
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar
                            src={currentUser.avatarUrl || '/images/avatars/default.svg'}
                            alt={currentUser.username}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              variant="outlined"
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: '#fff',
                                },
                              }}
                            />
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Button
                                size="small"
                                onClick={() => setReplyingTo(null)}
                                sx={{ color: 'text.secondary' }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!replyText.trim()}
                                sx={{
                                  borderRadius: 2,
                                  backgroundColor: '#6c5ce7',
                                  '&:hover': {
                                    backgroundColor: '#5a4fcf',
                                  },
                                }}
                              >
                                Reply
                              </Button>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {/* Ответы */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #e9ecef' }}>
                        <Stack spacing={2}>
                          {comment.replies.map((reply: any) => (
                            <Box key={reply.id}>
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Avatar
                                  src={reply.avatarUrl || '/images/avatars/default.svg'}
                                  alt={reply.username}
                                  sx={{ width: 32, height: 32 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: 2, 
                                    p: 1.5,
                                    border: '1px solid #e9ecef',
                                    position: 'relative',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      left: -6,
                                      top: 8,
                                      width: 0,
                                      height: 0,
                                      borderStyle: 'solid',
                                      borderWidth: '5px 5px 5px 0',
                                      borderColor: 'transparent #fff transparent transparent'
                                    }
                                  }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
                                      {reply.username}
                                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                      </Typography>
                                    </Typography>
                                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
                                      {reply.content}
                                    </Typography>
                                  </Box>
                                  

                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </DialogContent>
    </StyledDialog>
  )
} 