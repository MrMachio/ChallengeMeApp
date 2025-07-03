'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { UploadButton } from '@/lib/uploadthing'
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
  FormHelperText,
} from '@mui/material'

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
  const [imageUrl, setImageUrl] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      console.error('User not authenticated')
      return
    }

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.keycloak?.token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          image_url: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create challenge')
      }

      const challenge = await response.json()
      router.push(`/challenge/${challenge.id}`)
      onClose()
    } catch (error) {
      console.error('Error creating challenge:', error)
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
                <MenuItem value="fitness">Fitness</MenuItem>
                <MenuItem value="learning">Learning</MenuItem>
                <MenuItem value="creativity">Creativity</MenuItem>
                <MenuItem value="lifestyle">Lifestyle</MenuItem>
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
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel shrink>Image</InputLabel>
                <Box sx={{ mt: 3 }}>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) {
                        setImageUrl(res[0].url)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error('Upload error:', error)
                    }}
                  />
                </Box>
                {imageUrl && (
                  <FormHelperText>Image uploaded successfully</FormHelperText>
                )}
              </FormControl>
            </Box>
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={onClose}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
} 