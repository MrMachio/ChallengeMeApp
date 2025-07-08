'use client'

import { useState, useMemo, useEffect } from 'react'
import { Container, Box, Typography, Stack } from '@mui/material'
import UserCard, { UserCardSkeleton } from '@/components/UserCard'
import UsersFilters from '@/components/UsersFilters'
import { mockUsers } from '@/lib/mock/data'
import { useAuth } from '@/lib/providers/AuthProvider'

export type UserSortField = 'none' | 'points' | 'completedChallenges';
export type SortDirection = 'asc' | 'desc';
export type UserFilterType = 'all' | 'friends';

export interface UserSortConfig {
  field: UserSortField;
  direction: SortDirection;
}

// Преобразуем объект пользователей в массив
const usersArray = Object.values(mockUsers);

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterType, setFilterType] = useState<UserFilterType>('all')
  const [sortConfig, setSortConfig] = useState<UserSortConfig>({ field: 'none', direction: 'desc' })
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<typeof usersArray>([])
  const { user: currentUser } = useAuth()

  // Имитируем загрузку данных
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      // Имитируем задержку загрузки
      await new Promise(resolve => setTimeout(resolve, 800))
      setUsers(usersArray)
      setIsLoading(false)
    }

    loadUsers()
  }, [])

  // Filter and sort users using useMemo
  const sortedUsers = useMemo(() => {
    if (isLoading) return []

    // Filter users
    const filtered = users.filter(user => {
      // Исключаем текущего пользователя
      if (currentUser && user.id === currentUser.id) {
        return false
      }

      // Filter by type
      if (filterType === 'friends') {
        // TODO: Implement friends logic when friends feature is added
        // For now, show all users except current user
        return true
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          user.username.toLowerCase().includes(query) ||
          (user.fullName && user.fullName.toLowerCase().includes(query))
        )
      }
      return true
    })

    // If no sorting selected, return filtered array as is
    if (sortConfig.field === 'none') {
      return filtered;
    }

    // Sort users
    return [...filtered].sort((a, b) => {
      const multiplier = sortConfig.direction === 'desc' ? -1 : 1;

      switch (sortConfig.field) {
        case 'points':
          return (a.points - b.points) * multiplier;
        case 'completedChallenges':
          return (a.completedChallenges.length - b.completedChallenges.length) * multiplier;
        default:
          return 0;
      }
    })
  }, [searchQuery, filterType, sortConfig, users, isLoading, currentUser])

  // Создаем массив скелетонов для отображения во время загрузки
  const skeletonCards = Array.from({ length: 6 }, (_, index) => (
    <UserCardSkeleton key={`skeleton-${index}`} />
  ))

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with other challenge enthusiasts and see their achievements
        </Typography>
      </Box>

      <UsersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />

      <Stack spacing={2}>
        {isLoading ? (
          skeletonCards
        ) : (
          sortedUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))
        )}
      </Stack>

      {/* Message when no users found */}
      {!isLoading && sortedUsers.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 400px)'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            No users found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: '400px'
            }}
          >
            {searchQuery ? 
              `No users match your search "${searchQuery}". Try adjusting your search criteria.` :
              'No users found with the current filters.'
            }
          </Typography>
        </Box>
      )}
    </Container>
  )
} 