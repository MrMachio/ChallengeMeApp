'use client'

import { mockCategories } from '@/lib/mock/data'
import { Box, Button, Stack } from '@mui/material'

interface CategoryListProps {
  categories: {
    id: string
    name: string
    icon: string
  }[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onSelectCategory(selectedCategory === category.name ? null : category.name)}
          variant={selectedCategory === category.name ? "contained" : "outlined"}
          sx={{
            textTransform: 'none',
            gap: 1,
            bgcolor: selectedCategory === category.name ? 'primary.main' : 'background.paper',
            color: selectedCategory === category.name ? 'common.white' : 'text.primary',
            borderColor: selectedCategory === category.name ? 'primary.main' : 'grey.200',
            '&:hover': {
              bgcolor: selectedCategory === category.name ? 'primary.dark' : 'grey.50',
              borderColor: selectedCategory === category.name ? 'primary.dark' : 'grey.300',
            }
          }}
        >
          <Box component="span" sx={{ fontSize: '1.125rem' }}>
            {category.icon}
          </Box>
          {category.name}
        </Button>
      ))}
    </Stack>
  )
} 