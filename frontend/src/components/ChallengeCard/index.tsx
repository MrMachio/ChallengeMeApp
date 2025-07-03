'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Button,
  Divider,
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import GroupIcon from '@mui/icons-material/Group'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface ChallengeCardProps {
  challenge: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    points: number
    timeLimit: number | null
    imageUrl: string | null
    likesCount: number
    completionsCount: number
    creator: {
      username: string
      avatarUrl: string
    }
    createdAt: string
  }
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(challenge.likesCount)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(current => isLiked ? current - 1 : current + 1)
  }

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
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          height: '180px',
          width: '100%',
          bgcolor: 'grey.100',
          background: !challenge.imageUrl ? 'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)' : undefined
        }}
      >
        {challenge.imageUrl ? (
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            style={{ 
              objectFit: 'cover'
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography color="text.secondary">No image</Typography>
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 2
          }}
        >
          <Stack direction="row" spacing={0.75}>
            <Chip
              label={challenge.category}
              size="small"
              sx={{
                bgcolor: 'white',
                color: '#4B5563',
                fontSize: '13px',
                fontWeight: 500,
                height: '26px',
                borderRadius: '100px',
                px: '10px'
              }}
            />
            <Chip
              label={challenge.difficulty}
              size="small"
              sx={{
                bgcolor: getDifficultyColor(challenge.difficulty).bg,
                color: getDifficultyColor(challenge.difficulty).color,
                fontSize: '13px',
                fontWeight: 500,
                height: '26px',
                borderRadius: '100px',
                px: '10px'
              }}
            />
          </Stack>
          <Chip
            label={`${challenge.points} points`}
            size="small"
            sx={{
              bgcolor: '#F59E0B',
              color: 'white',
              fontSize: '13px',
              fontWeight: 500,
              height: '26px',
              borderRadius: '100px',
              px: '12px'
            }}
          />
        </Box>
      </Box>

      <CardContent 
        sx={{ 
          p: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        <Link href={`/challenge/${challenge.id}`} style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              mb: '8px',
              lineHeight: 1.3,
              '&:hover': { 
                color: 'primary.main'
              }
            }}
          >
            {challenge.title}
          </Typography>
        </Link>

        <Typography
          sx={{
            color: '#6B7280',
            fontSize: '14px',
            lineHeight: 1.5,
            mb: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {challenge.description}
        </Typography>

        <Box 
          sx={{ 
            mt: 'auto',
            pt: '12px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconButton
                onClick={handleLike}
                size="small"
                sx={{ 
                  p: 0,
                  color: '#9CA3AF',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main'
                  }
                }}
              >
                {isLiked ? (
                  <FavoriteIcon sx={{ width: 18, height: 18 }} color="error" />
                ) : (
                  <FavoriteBorderIcon sx={{ width: 18, height: 18 }} />
                )}
              </IconButton>
              <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                {likesCount}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GroupIcon sx={{ width: 18, height: 18, color: '#9CA3AF' }} />
              <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                {challenge.completionsCount}
              </Typography>
            </Box>

            {challenge.timeLimit && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AccessTimeIcon sx={{ width: 18, height: 18, color: '#9CA3AF' }} />
                <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                  {challenge.timeLimit}ч
                </Typography>
              </Box>
            )}
          </Stack>

          <Button
            component={Link}
            href={`/profile/${challenge.creator.username}`}
            sx={{
              textTransform: 'none',
              minWidth: 'auto',
              p: 0,
              '&:hover': { 
                bgcolor: 'transparent'
              }
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
              >
                <Image
                  src={challenge.creator.avatarUrl}
                  alt={challenge.creator.username}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Typography 
                sx={{
                  color: '#4B5563',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                {challenge.creator.username}
              </Typography>
            </Stack>
          </Button>
        </Box>

        <Typography 
          variant="caption" 
          sx={{ 
            color: '#6B7280',
            fontSize: '14px',
            mt: 2
          }}
        >
          {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
        </Typography>
      </CardContent>
    </Card>
  )
} 