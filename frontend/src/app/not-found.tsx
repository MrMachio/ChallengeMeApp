import NextLink from 'next/link'
import { Box, Typography, Button } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'

export default function NotFound() {
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
      <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1
          }}
        >
          Page Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Could not find requested resource
        </Typography>
      </Box>
      <Button
        component={NextLink}
        href="/"
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
        Return Home
      </Button>
    </Box>
  )
} 