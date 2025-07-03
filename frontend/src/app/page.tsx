'use client'

import { useState } from 'react'
import { Container, Box } from '@mui/material'
import ChallengeCard from '@/components/ChallengeCard'
import Filters from '@/components/Filters'
import { mockChallenges } from '@/lib/mock/data'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'points'>('popular')

  // Filter challenges
  const filteredChallenges = mockChallenges.filter(challenge => {
    // Filter by category
    if (selectedCategory !== 'all' && challenge.category !== selectedCategory) {
      return false
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

  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.likesCount - a.likesCount
      case 'points':
        return b.points - a.points
      default:
        return 0
    }
  })

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
      <Box 
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 !important'
        }}
      >
        <Filters
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
        />
      </Box>

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
        {sortedChallenges.map(challenge => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </Box>

      {/* Message when no challenges found */}
      {sortedChallenges.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 6
          }}
        >
          <Box 
            component="h3" 
            sx={{ 
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'text.primary',
              mb: 1
            }}
          >
            No challenges found
          </Box>
          <Box 
            component="p" 
            sx={{ 
              color: 'text.secondary'
            }}
          >
            Try adjusting your filters or create your own challenge!
          </Box>
        </Box>
      )}
    </Container>
  )
}
