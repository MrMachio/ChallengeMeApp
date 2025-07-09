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
  hideFilterSelect?: boolean; // Optional prop to hide filter select
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
  setSortConfig,
  hideFilterSelect = false
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
      direction="row"
      gap={1}
      sx={{
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
        minHeight: '56px' // Ensure enough height for InputLabel
      }}
    >
      <TextFieldStyled
        placeholder="Search users..."
        className='SearchField'
        size="small"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ flex: 1 }}
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

{!hideFilterSelect && (
        <FormControl
          size="small"
          sx={{
            minWidth: 120
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
      )}

      <FormControl
        size="small"
        sx={{
          minWidth: 120,
          position: 'relative',
          zIndex: 1200, // Add higher z-index for dropdown
          '& .MuiSelect-root': {
            zIndex: 1200
          },
          '& .MuiPopover-root': {
            zIndex: 1300
          },
          '& .MuiInputLabel-root': {
            zIndex: 1200
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: '100px'
            }
          }
        }}
      >
        <InputLabel>Sort</InputLabel>
        <Select
          value={sortConfig.field}
          label="Sort"
          onChange={handleSortFieldChange}
          sx={{
            borderRadius: '100px',
            backgroundColor: 'background.paper'
          }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="points">Points</MenuItem>
          <MenuItem value="completedChallenges">Completed</MenuItem>
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
    </Stack>
  )
} 