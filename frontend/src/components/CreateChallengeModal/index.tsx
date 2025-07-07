'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/AuthProvider'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Stack,
  IconButton,
  Typography,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { challengesApi } from '@/lib/api/challenges'
import { imagesApi } from '@/lib/api/images'
import { mockCategories } from '@/lib/mock/data'

interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
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
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

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

    try {
      setIsLoading(true)

      // Загружаем изображение
      let imageUrl = '/images/challenges/default.jpg'
      if (selectedFile) {
        imageUrl = await imagesApi.upload(selectedFile)
      }

      // Создаем задание
      const challenge = await challengesApi.create({
        title,
        description,
        category,
        difficulty,
        imageUrl,
        points
      }, user.id)

      router.refresh() // Обновляем список заданий на главной странице
      
      handleClose()
    } catch (error) {
      console.error('Error creating challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
          width: '600px',
          height: '900px',
          maxWidth: '600px',
          maxHeight: '900px',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle sx={{ px: 0 }}>
        Create New Challenge
      </DialogTitle>
      <DialogContent sx={{ 
        px: 0, 
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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="outlined"
            />
            
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
            />
            
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>Select category</em>
                </MenuItem>
                {mockCategories.map(cat => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="">
                  <em>Select difficulty</em>
                </MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Points"
              type="number"
              value={points}
              onChange={(e) => setPoints(Math.max(0, parseInt(e.target.value) || 0))}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 0 }}
            />
            
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="challenge-image"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="challenge-image">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Upload Image
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Selected file: {selectedFile.name}
                </Typography>
              )}
              {previewUrl && (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    position: 'relative'
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
              )}
            </Box>
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={handleClose}
                variant="outlined"
                color="inherit"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
} 