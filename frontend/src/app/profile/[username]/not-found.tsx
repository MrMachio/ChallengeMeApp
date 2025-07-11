'use client'

import Link from 'next/link'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import InfoIcon from '@mui/icons-material/Info'
import { useAuth } from '@/lib/hooks/useAuth'

export default function UserNotFound() {
  const { user } = useAuth()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="text.primary">
          Профиль недоступен
        </Typography>
        
        <Box sx={{ 
          backgroundColor: 'info.light', 
          borderRadius: 2, 
          p: 3, 
          mb: 4,
          textAlign: 'left'
        }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <InfoIcon sx={{ color: 'info.main', mt: 0.5 }} />
            <Box>
              <Typography variant="h6" color="info.main" gutterBottom>
                Временное ограничение
              </Typography>
              <Typography variant="body2" color="text.secondary">
                В настоящее время можно просматривать только свой профиль. 
                Функция просмотра профилей других пользователей будет доступна 
                после реализации соответствующих API endpoints в backend'е.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/"
            variant="outlined"
            size="large"
            sx={{
              borderRadius: '100px',
              px: 4,
              py: 1.5
            }}
          >
            На главную
          </Button>
          
          {user && (
            <Button
              component={Link}
              href={`/profile/${user.username}`}
              variant="contained"
              size="large"
              sx={{
                borderRadius: '100px',
                px: 4,
                py: 1.5
              }}
            >
              Мой профиль
            </Button>
          )}
        </Stack>
      </Paper>
    </Container>
  )
} 