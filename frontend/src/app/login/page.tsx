'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/AuthProvider'
import NextLink from 'next/link'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Link,
  CircularProgress
} from '@mui/material'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('test@example.com', 'password')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 6,
        px: { xs: 2, sm: 3, lg: 4 }
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            bgcolor: 'transparent'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700
              }}
            >
              Sign in to your account
            </Typography>
            <Typography color="text.secondary">
              Or{' '}
              <Link
                component={NextLink}
                href="/register"
                sx={{
                  color: 'primary.main',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                create a new account
              </Link>
            </Typography>
          </Box>

          <Button
            onClick={handleSignIn}
            disabled={loading}
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign in'
            )}
          </Button>
        </Paper>
      </Container>
    </Box>
  )
} 