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
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import GroupIcon from '@mui/icons-material/Group'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PersonIcon from '@mui/icons-material/Person'
import ChallengeModal from '../ChallengeModal'
import { mockCurrentUser, mockChallengeLikes, mockCompletions } from '@/lib/mock/data'
import { useAuth } from '@/lib/hooks/useAuth'

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
    creatorId: string
    creator: {
      username: string
      avatarUrl: string
    }
    createdAt: string
  }
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [completionsCount, setCompletionsCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  // Определяем статус челленджа для текущего пользователя
  const getChallengeStatus = () => {
    if (!user) return null;
    
    if (user.completedChallenges.includes(challenge.id.toString())) {
      return 'completed';
    }
    if (user.activeChallenges.includes(challenge.id.toString())) {
      return 'active';
    }
    if (challenge.creatorId === user.id) {
      return 'created';
    }
    return 'available';
  }

  const status = getChallengeStatus();

  // Получаем цвет и иконку для статуса
  const getStatusConfig = (status: string | null) => {
    switch(status) {
      case 'completed':
        return {
          icon: <CheckCircleIcon fontSize="small" />,
          label: 'Completed',
          color: 'success' as const
        };
      case 'active':
        return {
          icon: <PlayArrowIcon fontSize="small" />,
          label: 'In Progress',
          color: 'info' as const
        };
      case 'created':
        return {
          icon: <PersonIcon fontSize="small" />,
          label: 'Created by You',
          color: 'secondary' as const
        };
      default:
        return null;
    }
  }

  const statusConfig = getStatusConfig(status);

  // Обновляем состояние лайков и количество выполнивших
  const updateCounts = () => {
    const likes = mockChallengeLikes[challenge.id] || [];
    const userLiked = likes.includes(mockCurrentUser.id);
    setIsLiked(userLiked);
    setLikesCount(likes.length);

    const completions = mockCompletions[challenge.id] || [];
    setCompletionsCount(completions.length);
  }

  useEffect(() => {
    updateCounts();
  }, [challenge.id, modalOpen]); // Обновляем при открытии/закрытии модального окна

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Уменьшаем задержку до 100-200мс
    setTimeout(() => {
      const likes = mockChallengeLikes[challenge.id] || [];
      if (!isLiked) {
        mockChallengeLikes[challenge.id] = [...likes, mockCurrentUser.id];
      } else {
        mockChallengeLikes[challenge.id] = likes.filter(id => id !== mockCurrentUser.id);
      }
      updateCounts(); // Обновляем состояние сразу после изменения
    }, Math.random() * 100 + 100);
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
    <>
      <Card 
        onClick={() => setModalOpen(true)}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            '& img': {
              transform: 'scale(1.1)'
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
              {statusConfig && (
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  size="small"
                  color={statusConfig.color}
                  sx={{
                    bgcolor: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    height: '26px',
                    borderRadius: '100px',
                    px: '10px'
                  }}
                />
              )}
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
                  sx={{ 
                    p: 0,
                    color: '#9CA3AF',
                    '&:hover': {
                      color: '#F87171'
                    }
                  }}
                >
                  {isLiked ? (
                    <FavoriteIcon sx={{ fontSize: 20, color: '#F87171' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    fontSize: '14px'
                  }}
                >
                  {likesCount}
                </Typography>
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
                  {completionsCount}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar
                src={challenge.creator.avatarUrl}
                alt={challenge.creator.username}
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