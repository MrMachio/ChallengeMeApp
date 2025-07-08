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
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import InputAdornment from '@mui/material/InputAdornment'
import { TextFieldStyled } from '../Filters/styledWrappers'
import { UserSortConfig, UserSortField, SortDirection, UserFilterType } from '@/app/users/page'
import { keyframes } from '@mui/system'

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

interface UsersFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: UserFilterType;
  setFilterType: (value: UserFilterType) => void;
  sortConfig: UserSortConfig;
  setSortConfig: (value: UserSortConfig) => void;
}

const FILTER_OPTIONS: { value: UserFilterType; label: string }[] = [
  { value: 'all', label: 'All Users' },
  { value: 'friends', label: 'Friends' }
];

export default function UsersFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortConfig,
  setSortConfig
}: UsersFiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
  }

  const handleFilterChange = (event: SelectChangeEvent<UserFilterType>) => {
    const value = event.target.value as UserFilterType;
    setFilterType(value);
  }

  const handleSortFieldChange = (event: SelectChangeEvent<UserSortField>) => {
    const newField = event.target.value as UserSortField;
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

  const getSortLabel = (field: UserSortField): string => {
    switch (field) {
      case 'none':
        return 'No Sorting';
      case 'points':
        return 'By Points';
      case 'completedChallenges':
        return 'By Completed';
      default:
        return '';
    }
  }

  return (
    <Stack
      className='UsersFiltersWrapper'
      direction={{ xs: 'column', sm: 'row' }}
      gap='8px'
      sx={{
        width: '100%',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between'
      }}
    >
      <TextFieldStyled
        placeholder="Search users by name or username..."
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
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 150 }
          }}
        >
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterType}
            label="Filter"
            onChange={handleFilterChange}
            sx={{
              borderRadius: '100px',
              backgroundColor: 'background.paper'
            }}
          >
            {FILTER_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: 180 }
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
              <MenuItem value="points">By Points</MenuItem>
              <MenuItem value="completedChallenges">By Completed Challenges</MenuItem>
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