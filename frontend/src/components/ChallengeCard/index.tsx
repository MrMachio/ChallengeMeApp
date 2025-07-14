'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  Skeleton,
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import GroupIcon from '@mui/icons-material/Group'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PersonIcon from '@mui/icons-material/Person'
import ChallengeModal from '../ChallengeModal'
import FavoriteButton from '../FavoriteButton'
import { mockChallengeLikes, mockCompletions, mockUsers } from '@/lib/mock/data'
import { useAuth } from '@/lib/providers/AuthProvider'
import { getDifficultyColor } from '@/lib/utils'
import { Challenge } from '@/lib/types/api.types'

export interface ChallengeCardProps {
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
    creatorId: string
    creator: {
      username: string
      avatarUrl: string
    }
    createdAt: string
  }
  disableInteractions?: boolean
}

// Skeleton component for loading
export function ChallengeCardSkeleton() {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        bgcolor: 'background.paper',
      }}
    >
      {/* Image skeleton */}
      <Box sx={{ height: '180px', width: '100%' }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
        />
      </Box>

      <CardContent sx={{ p: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Title skeleton */}
        <Skeleton 
          variant="text" 
          width="80%" 
          height={28} 
          sx={{ mb: '8px' }}
          animation="wave"
        />

        {/* Description skeleton */}
        <Skeleton 
          variant="text" 
          width="100%" 
          height={20} 
          sx={{ mb: '4px' }}
          animation="wave"
        />
        <Skeleton 
          variant="text" 
          width="60%" 
          height={20} 
          sx={{ mb: '16px' }}
          animation="wave"
        />

        {/* Footer skeleton */}
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
              <Skeleton variant="circular" width={20} height={20} animation="wave" />
              <Skeleton variant="text" width={20} height={20} animation="wave" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Skeleton variant="circular" width={20} height={20} animation="wave" />
              <Skeleton variant="text" width={20} height={20} animation="wave" />
            </Box>
          </Stack>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Skeleton variant="circular" width={24} height={24} animation="wave" />
            <Skeleton variant="text" width={60} height={16} animation="wave" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function ChallengeCard({ challenge, disableInteractions = false }: ChallengeCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user || disableInteractions) return
    // TODO: Implement when like endpoint is ready
  }

  return (
    <>
      <Card 
        onClick={() => !disableInteractions && setModalOpen(true)}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          bgcolor: 'background.paper',
          cursor: disableInteractions ? 'default' : 'pointer',
          '&:hover': {
            transform: disableInteractions ? 'none' : 'translateY(-4px)',
            boxShadow: disableInteractions ? '0 4px 20px rgba(0, 0, 0, 0.05)' : '0 8px 25px rgba(0, 0, 0, 0.1)',
            '& img': {
              transform: disableInteractions ? 'none' : 'scale(1.1)'
            }
          }
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            height: '180px',
            width: '100%',
            bgcolor: 'grey.100',
            background: !challenge.imageUrl ? 'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)' : undefined,
            overflow: 'hidden'
          }}
        >
          {challenge.imageUrl ? (
            <Image
              src={challenge.imageUrl}
              alt={challenge.title}
              fill
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              mb: '8px',
              lineHeight: 1.3
            }}
          >
            {challenge.title}
          </Typography>

          <Typography
            sx={{
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: 1.5,
              mb: '16px',
              minHeight: '42px',
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
                  disabled={disableInteractions}
                  sx={{ 
                    p: 0,
                    color: '#9CA3AF',
                    '&:hover': !disableInteractions ? {
                      color: '#F87171'
                    } : {},
                    '&.Mui-disabled': {
                      color: '#9CA3AF'
                    }
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    fontSize: '14px'
                  }}
                >
                  0
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FavoriteButton 
                  challengeId={challenge.id}
                  disabled={!user || disableInteractions}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GroupIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    fontSize: '14px'
                  }}
                >
                  {challenge.completionsCount || 0}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar
                src={challenge.creator?.avatarUrl || '/images/avatars/default.svg'}
                alt={challenge.creator?.username || 'Unknown User'}
                sx={{ width: 24, height: 24 }}
              />
              <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <ChallengeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        challenge={challenge}
      />
    </>
  )
} 