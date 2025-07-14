'use client'

import {useState, useMemo} from 'react'
import {Container, Box, Typography, Fab, Alert, Button} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChallengeCard, { ChallengeCardSkeleton } from '@/components/ChallengeCard'
import Filters from '@/components/Filters'
import CreateChallengeModal from '@/components/CreateChallengeModal'
import { useAuth } from '@/lib/providers/AuthProvider'
import { createSkeletonArray } from '@/lib/utils'
import { useGetChallengesQuery } from '@/lib/store/api/challengesApi'

export type Category = "All Categories" | "Educational" | "Environmental" | "Sports" | "Creative" | "Social" | "Other" | "Favorites";

export type ChallengeStatus = 'all' | 'completed' | 'active' | 'created' | 'available';

export interface SortConfig {
  field: 'none' | 'points' | 'completions' | 'created' | 'likes';
  direction: 'asc' | 'desc';
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['All Categories'])
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'none', direction: 'desc' })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { user } = useAuth()

  // Get challenges from API using RTK Query
  const { data: challenges = [], isLoading, error, refetch } = useGetChallengesQuery({
    category: selectedCategories.includes('All Categories') ? undefined : selectedCategories[0],
    sortType: sortConfig.field === 'none' ? undefined : `${sortConfig.field}_${sortConfig.direction}`,
    userConnectionType: selectedStatus === 'all' ? undefined : selectedStatus
  })

  // Filter challenges using useMemo
  const filteredChallenges = useMemo(() => {
    if (isLoading) return []

    return challenges.filter(challenge => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          challenge.title.toLowerCase().includes(query) ||
          challenge.description.toLowerCase().includes(query) ||
          challenge.category.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [searchQuery, challenges, isLoading])

  // Create skeleton array for loading display
  const skeletonCards = createSkeletonArray(9, ChallengeCardSkeleton)

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
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        user={user}
      />

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Try Again
            </Button>
          }
        >
          Failed to load challenges. Please check your connection and try again.
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          mt: 0
        }}
      >
        {isLoading ? (
          skeletonCards
        ) : filteredChallenges.length > 0 ? (
          filteredChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))
        ) : (
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: 'text.primary',
              }}
            >
              No challenges found
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary'
              }}
            >
              Try adjusting your filters or create your own challenge!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Floating action button */}
      {user && !isLoading && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsCreateModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
            },
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create challenge modal */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Container>
  )
}
