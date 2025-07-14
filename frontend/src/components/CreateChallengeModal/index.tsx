'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/AuthProvider'
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  Chip,
  Paper,
  Alert,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SchoolIcon from '@mui/icons-material/School'
import NatureIcon from '@mui/icons-material/Nature'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PaletteIcon from '@mui/icons-material/Palette'
import GroupIcon from '@mui/icons-material/Group'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useCreateChallengeMutation } from '@/lib/store/api/challengesApi'
import { mockCategories } from '@/lib/mock/data'
import { CreateChallengeRequest } from '@/lib/types/api.types'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '600px',
    width: '600px',
    height: '800px',
    maxHeight: '800px',
    margin: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(5px)'
  }
}))

const ImageUploadArea = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '180px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  border: '2px dashed #dee2e6',
  borderRadius: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#e9ecef',
    borderColor: '#adb5bd'
  }
}))

const CategoryChip = styled(Chip)<{ selected: boolean }>(({ theme, selected }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5, 1),
  height: 'auto',
  fontWeight: 500,
  backgroundColor: selected ? theme.palette.primary.main : '#f8f9fa',
  color: selected ? 'white' : theme.palette.text.primary,
  border: selected ? 'none' : '1px solid #dee2e6',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : '#e9ecef',
  }
}))

const DifficultyChip = styled(Chip)<{ selected: boolean; difficulty: string }>(({ theme, selected, difficulty }) => {
  let bgColor = '#f8f9fa';
  let hoverColor = '#e9ecef';
  let borderColor = '#dee2e6';
  
  if (selected) {
    switch (difficulty) {
      case 'Easy':
        bgColor = '#d4edda';
        hoverColor = '#c3e6cb';
        break;
      case 'Medium':
        bgColor = '#fff3cd';
        hoverColor = '#ffeaa7';
        break;
      case 'Hard':
        bgColor = '#f8d7da';
        hoverColor = '#f5c6cb';
        break;
    }
    borderColor = 'transparent';
  }
  
  return {
    borderRadius: theme.spacing(3),
    padding: theme.spacing(0.5, 1),
    height: 'auto',
    fontWeight: 500,
    backgroundColor: bgColor,
    color: theme.palette.text.primary,
    border: `1px solid ${borderColor}`,
    '&:hover': {
      backgroundColor: hoverColor,
    }
  };
})

interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
}

const categories = mockCategories
const difficulties = ['Easy', 'Medium', 'Hard']

const renderCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'SchoolIcon':
      return <SchoolIcon />
    case 'NatureIcon':
      return <NatureIcon />
    case 'FitnessCenterIcon':
      return <FitnessCenterIcon />
    case 'PaletteIcon':
      return <PaletteIcon />
    case 'GroupIcon':
      return <GroupIcon />
    case 'MoreHorizIcon':
      return <MoreHorizIcon />
    default:
      return <MoreHorizIcon />
  }
}

const getPointsRange = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return { min: 50, max: 200, recommended: '50-200' }
    case 'Medium':
      return { min: 200, max: 600, recommended: '200-600' }
    case 'Hard':
      return { min: 600, max: 1000, recommended: '600-1000' }
    default:
      return { min: 50, max: 500, recommended: '50-500' }
  }
}

export default function CreateChallengeModal({
  isOpen,
  onClose,
}: CreateChallengeModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [points, setPoints] = useState<number>(100)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Use RTK Query mutation
  const [createChallenge, { isLoading, error }] = useCreateChallengeMutation()

  const pointsRange = getPointsRange(difficulty)

  const handleClose = () => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    
    // Reset form
    setTitle('')
    setDescription('')
    setCategory('')
    setDifficulty('')
    setPoints(100)
    setSelectedFile(null)
    
    onClose()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      console.error('User not authenticated')
      return
    }

    if (!title || !description || !category || !difficulty) {
      return
    }

    try {
      const challengeData: CreateChallengeRequest = {
        title,
        description,
        category: category.toLowerCase(), // Convert to lowercase to match backend enum
        difficulty: difficulty.toLowerCase(), // Convert difficulty to lowercase as well for consistency
        points,
        coverImageUrl: previewUrl || null
      }

      // Create challenge using RTK Query mutation
      await createChallenge(challengeData).unwrap()

      router.refresh() // Refresh the challenges list
      handleClose()
    } catch (err) {
      console.error('Error creating challenge:', err)
      // The error is already handled by RTK Query's error handling
    }
  }

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ 
        p: 3, 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Challenge Image */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Challenge Image
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="challenge-image-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="challenge-image-upload">
                <ImageUploadArea>
                  {previewUrl ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Challenge preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ) : (
                    <>
                      <CameraAltIcon sx={{ fontSize: 40, color: '#6c757d', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Upload an image for your challenge
                      </Typography>
                      <Button
                        component="span"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1, borderRadius: 2 }}
                      >
                        Choose File
                      </Button>
                    </>
                  )}
                </ImageUploadArea>
              </label>
            </Box>

            {/* Challenge Title */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Challenge Title *
              </Typography>
              <TextField
                placeholder="Enter an attractive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '& fieldset': {
                      borderColor: '#dee2e6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#adb5bd',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6c5ce7',
                    },
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Description *
              </Typography>
              <TextField
                placeholder="Describe the essence of the challenge, rules and goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '& fieldset': {
                      borderColor: '#dee2e6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#adb5bd',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6c5ce7',
                    },
                  },
                }}
              />
            </Box>

            {/* Category */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Category *
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    label={cat.name}
                    icon={renderCategoryIcon(cat.icon)}
                    selected={category === cat.name}
                    onClick={() => setCategory(cat.name)}
                    clickable
                  />
                ))}
              </Stack>
            </Box>

            {/* Difficulty */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Difficulty *
              </Typography>
              <Stack direction="row" spacing={1}>
                {difficulties.map((diff) => (
                  <DifficultyChip
                    key={diff}
                    label={diff}
                    selected={difficulty === diff}
                    difficulty={diff}
                    onClick={() => setDifficulty(diff)}
                    clickable
                  />
                ))}
              </Stack>
            </Box>



            {/* Points for Completion */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Points for Completion
              </Typography>
              <TextField
                type="number"
                value={points}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setPoints(value);
                }}
                fullWidth
                variant="outlined"
                inputProps={{ 
                  min: pointsRange.min, 
                  max: pointsRange.max 
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '& fieldset': {
                      borderColor: '#dee2e6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#adb5bd',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6c5ce7',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  💡 Recommended points: {pointsRange.recommended}
                </Typography>
              </Box>
            </Box>

            {/* Buttons */}
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                fullWidth
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: '#dee2e6',
                  color: '#6c757d',
                  '&:hover': {
                    borderColor: '#adb5bd',
                    backgroundColor: '#f8f9fa',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !title || !description || !category || !difficulty}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: '#6c5ce7',
                  '&:hover': {
                    backgroundColor: '#5a4fcf',
                  },
                }}
              >
                {isLoading ? 'Creating...' : 'Create Challenge'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </StyledDialog>
  )
} 