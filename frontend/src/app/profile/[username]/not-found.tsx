'use client'

import Link from 'next/link'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

export default function UserNotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="text.primary">
          User not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The user you're looking for doesn't exist or has been removed.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{
            borderRadius: '100px',
            px: 4,
            py: 1.5
          }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  )
} 