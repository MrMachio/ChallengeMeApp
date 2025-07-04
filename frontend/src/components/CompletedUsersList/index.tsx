'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Box, Typography, Rating, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

const CompletionCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

interface CompletedUser {
  id: string
  username: string
  avatarUrl: string | null
  rating: number
  likes: number
  dislikes: number
}

interface CompletedUsersListProps {
  users: CompletedUser[]
}

export default function CompletedUsersList({ users }: CompletedUsersListProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
      {users.map((user) => (
        <CompletionCard key={user.id} sx={{ minWidth: 280 }}>
          <Box sx={{ position: 'relative', width: '100%', height: 160, borderRadius: 1, overflow: 'hidden' }}>
            <Image
              src={user.avatarUrl || '/images/avatars/default.svg'}
              alt={user.username}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
              <Typography variant="subtitle1" color="text.primary">
                {user.username}
              </Typography>
            </Link>
            <Rating value={user.rating} readOnly size="small" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              👍 {user.likes}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              👎 {user.dislikes}
            </Typography>
          </Box>
        </CompletionCard>
      ))}
    </Box>
  )
} 