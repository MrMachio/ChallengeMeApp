'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
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
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
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
      onClose()
    } catch (error) {
      console.error('Error creating challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ px: 0 }}>
        Create New Challenge
      </DialogTitle>
      <DialogContent sx={{ px: 0 }}>
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
                <Typography variant="body2" color="textSecondary">
                  Selected file: {selectedFile.name}
                </Typography>
              )}
            </Box>
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={onClose}
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