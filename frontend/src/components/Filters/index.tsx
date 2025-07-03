'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'

interface FiltersProps {
  onCategoryChange?: (category: string) => void
  onSortChange?: (sort: 'newest' | 'popular' | 'points') => void
  onSearch?: (query: string) => void
}

export default function Filters({
  onCategoryChange,
  onSortChange,
  onSearch
}: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'points'>('popular')

  // Используем useEffect для начальной установки значений
  useEffect(() => {
    onCategoryChange?.(category)
    onSortChange?.(sortBy)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleCategoryChange = (event: any) => {
    const value = event.target.value
    setCategory(value)
    onCategoryChange?.(value)
  }

  const handleSortChange = (event: any) => {
    const value = event.target.value as 'newest' | 'popular' | 'points'
    setSortBy(value)
    onSortChange?.(value)
  }

  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2} 
      sx={{ 
        width: '100%',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between'
      }}
    >
      <TextField
        placeholder="Поиск заданий..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          )
        }}
        sx={{ 
          flex: { xs: '1 1 100%', sm: '1 1 50%' },
          minWidth: { xs: '100%', sm: '300px' },
          maxWidth: { sm: '600px' },
          '& .MuiOutlinedInput-root': {
            borderRadius: '100px',
            backgroundColor: 'background.paper',
            '& fieldset': {
              borderColor: 'divider'
            },
            '&:hover fieldset': {
              borderColor: 'primary.main'
            }
          }
        }}
      />

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2}
        sx={{
          flex: { xs: '1 1 100%', sm: '0 1 auto' },
          minWidth: { xs: '100%', sm: 'auto' }
        }}
      >
        <FormControl 
          sx={{ 
            minWidth: { xs: '100%', sm: 200 }
          }}
        >
          <InputLabel>Категория</InputLabel>
          <Select
            value={category}
            label="Категория"
            onChange={handleCategoryChange}
            sx={{
              borderRadius: '100px',
              backgroundColor: 'background.paper'
            }}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="Educational">Образование</MenuItem>
            <MenuItem value="Environmental">Экология</MenuItem>
            <MenuItem value="Sports">Спорт</MenuItem>
            <MenuItem value="Creative">Творчество</MenuItem>
            <MenuItem value="Social">Социальное</MenuItem>
            <MenuItem value="Other">Другое</MenuItem>
          </Select>
        </FormControl>

        <FormControl 
          sx={{ 
            minWidth: { xs: '100%', sm: 200 }
          }}
        >
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortBy}
            label="Сортировка"
            onChange={handleSortChange}
            sx={{
              borderRadius: '100px',
              backgroundColor: 'background.paper'
            }}
          >
            <MenuItem value="popular">Популярные</MenuItem>
            <MenuItem value="newest">Новые</MenuItem>
            <MenuItem value="points">По очкам</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
} 