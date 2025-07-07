'use client'

import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  SelectChangeEvent,
  IconButton,
  Box,
  Tooltip,
  Chip,
  OutlinedInput
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import InputAdornment from '@mui/material/InputAdornment'
import {TextFieldStyled} from "./styledWrappers";
import {Category, SortConfig, SortField, SortDirection, ChallengeStatus} from "@/app/page";
import { keyframes } from '@mui/system';
import { User } from '@/lib/providers/AuthProvider';

// Определяем анимации для стрелки
const rotateUp = keyframes`
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

const rotateDown = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

interface FiltersProps {
  searchQuery?: string;
  setSearchQuery: (value: string) => void;
  selectedCategories: Category[];
  setSelectedCategories: (value: Category[]) => void;
  selectedStatus: ChallengeStatus;
  setSelectedStatus: (value: ChallengeStatus) => void;
  sortConfig: SortConfig;
  setSortConfig: (value: SortConfig) => void;
  user: User | null;
}

const CATEGORIES: Category[] = [
  "Educational",
  "Environmental",
  "Sports",
  "Creative",
  "Social",
  "Other"
];

const STATUS_OPTIONS: { value: ChallengeStatus; label: string }[] = [
  { value: 'all', label: 'All Challenges' },
  { value: 'completed', label: 'Completed' },
  { value: 'active', label: 'In Progress' },
  { value: 'created', label: 'Created by Me' },
  { value: 'available', label: 'Available' }
];

export default function Filters({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  sortConfig,
  setSortConfig,
  user
}: FiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
  }

  const handleCategoryChange = (event: SelectChangeEvent<Category[]>) => {
    const value = event.target.value as Category[];
    setSelectedCategories(typeof value === 'string' ? [value] : value);
  }

  const handleStatusChange = (event: SelectChangeEvent<ChallengeStatus>) => {
    const value = event.target.value as ChallengeStatus;
    setSelectedStatus(value);
  }

  const handleSortFieldChange = (event: SelectChangeEvent<SortField>) => {
    const newField = event.target.value as SortField;
    setSortConfig({
      field: newField,
      direction: newField === 'none' ? 'desc' : sortConfig.direction
    });
  }

  const toggleSortDirection = () => {
    setSortConfig({
      ...sortConfig,
      direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const handleClear = () => {
    setSearchQuery('');
  }

  const getSortLabel = (field: SortField): string => {
    switch (field) {
      case 'none':
        return 'No Sorting';
      case 'completions':
        return 'By Completions';
      case 'points':
        return 'By Points';
      case 'likes':
        return 'By Likes';
      default:
        return '';
    }
  }

  return (
    <Stack
      className='FiltersWrapper'
      direction={{ xs: 'column', sm: 'row' }}
      gap='8px'
      sx={{
        width: '100%',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between'
      }}
    >
      <TextFieldStyled
        placeholder="Search challenges..."
        className='SearchField'
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment 
              position="end" 
              onClick={handleClear}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiSvgIcon-root': {
                    color: 'text.primary'
                  }
                }
              }}
            >
              <CloseIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ) : null
        }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap='8px'
        sx={{
          flex: { xs: '1 1 100%', sm: '0 1 auto' },
          minWidth: { xs: '100%', sm: 'auto' }
        }}
      >
        {user && (
          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: 200 }
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={handleStatusChange}
              sx={{
                borderRadius: '100px',
                backgroundColor: 'background.paper'
              }}
            >
              {STATUS_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 200 }
          }}
        >
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{
              borderRadius: '100px',
              backgroundColor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '100px',
              }
            }}
          >
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: 200 }
            }}
          >
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortConfig.field}
              label="Sort by"
              onChange={handleSortFieldChange}
              sx={{
                borderRadius: '100px',
                backgroundColor: 'background.paper'
              }}
            >
              <MenuItem value="none">No Sorting</MenuItem>
              <MenuItem value="completions">By Completions</MenuItem>
              <MenuItem value="points">By Points</MenuItem>
              <MenuItem value="likes">By Likes</MenuItem>
            </Select>
          </FormControl>
          
          {sortConfig.field !== 'none' && (
            <Tooltip title={sortConfig.direction === 'desc' ? "Sort Descending" : "Sort Ascending"}>
              <IconButton
                onClick={toggleSortDirection}
                sx={{
                  animation: `${sortConfig.direction === 'desc' ? rotateDown : rotateUp} 0.2s forwards`,
                }}
              >
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}