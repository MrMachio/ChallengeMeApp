'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/providers/AuthProvider'
import { formatDistanceToNow } from 'date-fns'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import GroupIcon from '@mui/icons-material/Group'

interface Challenge {
  id: string
  title: string
  description: string
  imageUrl: string | null
  createdAt: string
  creatorId: string
  category: string
  difficulty: string
  points: number
  rules: string[]
  creator: {
    username: string
    avatarUrl: string | null
  }
  likes: Array<{ user_id: string }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      username: string
      avatarUrl: string | null
    }
  }>
  completions: Array<{
    id: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    user: {
      username: string
      avatarUrl: string | null
    }
  }>
}

const ImageContainer = styled(Box)({
  position: 'relative',
  height: '400px',
  width: '100%',
  overflow: 'hidden'
})

const HeaderChips = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  zIndex: 1
}))

export default function ChallengePage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${params.id}`)
        if (!response.ok) {
          throw new Error('Challenge not found')
        }
        const data = await response.json()
        setChallenge(data)
      } catch (error) {
        console.error('Error fetching challenge:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [params.id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (!challenge) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Challenge not found</Typography>
      </Box>
    )
  }

  const isOwner = user?.id === challenge.creatorId

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <ImageContainer>
          <Image
            src={challenge.imageUrl || '/images/challenges/default.jpg'}
            alt={challenge.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <HeaderChips>
            <Stack direction="row" spacing={1}>
              <Chip
                label={challenge.category}
                sx={{
                  bgcolor: 'white',
                  color: 'text.primary',
                  fontWeight: 500
                }}
              />
              <Chip
                label={challenge.difficulty}
                sx={{
                  bgcolor: 'white',
                  color: 'text.primary',
                  fontWeight: 500
                }}
              />
            </Stack>
            <Chip
              label={`${challenge.points} points`}
              sx={{
                bgcolor: 'warning.main',
                color: 'white',
                fontWeight: 500
              }}
            />
          </HeaderChips>
        </ImageContainer>

        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {challenge.title}
            </Typography>
                          <IconButton onClick={() => setIsBookmarked(!isBookmarked)}>
                {isBookmarked ? <BookmarkIcon sx={{ color: '#FFD700' }} /> : <BookmarkBorderIcon />}
              </IconButton>
          </Box>

          <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => setIsLiked(!isLiked)}
                sx={{ color: isLiked ? 'error.main' : 'inherit' }}
              >
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography color="text.secondary">
                {challenge.likes.length} likes
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon sx={{ color: 'action.active' }} />
              <Typography color="text.secondary">
                {challenge.completions.length} completions
              </Typography>
            </Box>
          </Stack>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {challenge.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Challenge Rules:
            </Typography>
            <List>
              {challenge.rules.map((rule, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rule} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box 
              component={Link} 
              href={`/profile/${challenge.creator.username}`}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Avatar
                src={challenge.creator.avatarUrl || '/images/avatars/default.svg'}
                alt={challenge.creator.username}
              />
              <Box>
                <Typography variant="subtitle2">
                  {user?.id === challenge.creatorId ? 'you' : challenge.creator.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #9c27b0 30%, #d81b60 90%)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '100px'
              }}
            >
              Accept Challenge
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Recently Completed:
        </Typography>
        <List>
          {challenge.completions.map((completion) => (
            <ListItem
              key={completion.id}
              secondaryAction={
                <Button color="primary">View</Button>
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={completion.user.avatarUrl || '/images/avatars/default.svg'}
                  alt={completion.user.username}
                />
              </ListItemAvatar>
              <ListItemText
                primary={completion.user.username}
                secondary={
                  completion.status === 'approved'
                    ? 'Completed'
                    : completion.status === 'rejected'
                    ? 'Rejected'
                    : 'Pending'
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Comments:
        </Typography>
        <List>
          {challenge.comments.map((comment) => (
            <ListItem key={comment.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  src={comment.user.avatarUrl || '/images/avatars/default.svg'}
                  alt={comment.user.username}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                      {comment.user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                }
                secondary={comment.content}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
} 