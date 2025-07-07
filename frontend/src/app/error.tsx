'use client'

import { useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Box
      sx={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          textAlign: 'center'
        }}
      >
        Something went wrong!
      </Typography>
      <Button
        onClick={() => reset()}
        variant="contained"
        size="large"
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          fontSize: '1rem'
        }}
      >
        Try again
      </Button>
    </Box>
  )
} 