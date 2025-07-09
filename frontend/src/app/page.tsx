'use client'

import {useState, useMemo, useEffect} from 'react'
import {Container, Box, Typography, Button, Fab} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChallengeCard, { ChallengeCardSkeleton } from '@/components/ChallengeCard'
import Filters from '@/components/Filters'
import CreateChallengeModal from '@/components/CreateChallengeModal'
import {mockChallenges, mockChallengeLikes, mockCompletions} from '@/lib/mock/data'
import { useAuth } from '@/lib/providers/AuthProvider'
import { createSkeletonArray } from '@/lib/utils'

export type Category = "All Categories" | "Educational" | "Environmental" | "Sports" | "Creative" | "Social" | "Other" | "Favorites";
export type SortField = 'none' | 'completions' | 'points' | 'likes';
export type SortDirection = 'asc' | 'desc';
export type ChallengeStatus = 'all' | 'completed' | 'active' | 'created' | 'available';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['All Categories'])
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'none', direction: 'desc' })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [challenges, setChallenges] = useState<typeof mockChallenges>([])
  const { user } = useAuth()

  // Simulate data loading
  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true)
      setChallenges(mockChallenges)
      setIsLoading(false)
    }

    loadChallenges()
  }, [])

  // Filter and sort challenges using useMemo
  const sortedChallenges = useMemo(() => {
    if (isLoading) return []

    // Filter challenges
    const filtered = challenges.filter(challenge => {
      const challengeId = challenge.id.toString();
      
      // Filter by category
      if (selectedCategories.length > 0 && !selectedCategories.includes('All Categories')) {
        const hasFavorites = selectedCategories.includes('Favorites');
        const regularCategories = selectedCategories.filter(cat => cat !== 'Favorites' && cat !== 'All Categories');
        
        let categoryMatch = false;
        
        // Check if challenge matches regular categories
        if (regularCategories.length > 0 && regularCategories.includes(challenge.category as any)) {
          categoryMatch = true;
        }
        
        // Check if challenge is in favorites
        if (hasFavorites && user && user.favoritesChallenges.includes(challengeId)) {
          categoryMatch = true;
        }
        
        // If no match found and we have filters, exclude this challenge
        if (!categoryMatch) {
          return false;
        }
      }

      // Filter by status
      if (selectedStatus !== 'all') {
        // If user is not authenticated, show only available challenges
        if (!user) {
          return selectedStatus === 'available';
        }

        console.log('Filtering challenge:', {
          challengeId,
          selectedStatus,
          userCompletedChallenges: user.completedChallenges,
          userActiveChallenges: user.activeChallenges,
          challengeCreatorId: challenge.creatorId,
          userId: user.id
        });

        switch (selectedStatus) {
          case 'completed':
            return user.completedChallenges.includes(challengeId);
          case 'active':
            return user.activeChallenges.includes(challengeId);
          case 'created':
            return challenge.creatorId === user.id;
          case 'available':
            return !user.completedChallenges.includes(challengeId) &&
                   !user.activeChallenges.includes(challengeId) &&
                   challenge.creatorId !== user.id;
          default:
            return true;
        }
      }

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

    // If no sorting selected, return filtered array as is
    if (sortConfig.field === 'none') {
      return filtered;
    }

    // Sort challenges
    return [...filtered].sort((a, b) => {
      const multiplier = sortConfig.direction === 'desc' ? -1 : 1;

      switch (sortConfig.field) {
        case 'completions':
          const completionsA = (mockCompletions[a.id.toString()] || []).length;
          const completionsB = (mockCompletions[b.id.toString()] || []).length;
          return (completionsA - completionsB) * multiplier;
        case 'points':
          return (a.points - b.points) * multiplier;
        case 'likes':
          const likesA = (mockChallengeLikes[a.id.toString()] || []).length;
          const likesB = (mockChallengeLikes[b.id.toString()] || []).length;
          return (likesA - likesB) * multiplier;
        default:
          return 0;
      }
    })
  }, [searchQuery, selectedCategories, selectedStatus, sortConfig, user, challenges, isLoading])

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
      {/*<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
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
      {/*</Box>*/}

      <Box
        className='ChalegeList'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          mt: 0,
          '& > *': {
            flexGrow: 0,
            flexShrink: 0,
            width: {
              xs: '100%',
              sm: 'calc(50% - 12px)',
              md: 'calc(33.333% - 16px)'
            }
          }
        }}
      >
        {isLoading || !sortedChallenges ? (
          skeletonCards
        ) : (
          sortedChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge}/>
          ))
        )}
      </Box>

      {/* Message when no challenges found */}
      {!isLoading && sortedChallenges.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vw - 300px)'
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

      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Container>
  )
}
