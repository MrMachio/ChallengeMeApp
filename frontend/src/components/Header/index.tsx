'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Image from 'next/image'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  IconButton,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import UserProfileModal from '../UserProfileModal'

export default function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenProfile = () => {
    handleCloseMenu()
    setIsProfileOpen(true)
  }

  return (
    <>
      <AppBar position="static" color="inherit" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 64 }}>
            <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
              <Image
                src="/trophy.svg"
                alt="ChallengeMeApp"
                width={32}
                height={32}
              />
              <Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  Challenge Me
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Take challenges, achieve goals
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Chip
                    icon={<EmojiEventsIcon />}
                    label={user.points}
                    sx={{
                      bgcolor: 'amber.100',
                      color: 'amber.800',
                      '& .MuiChip-icon': {
                        color: 'inherit'
                      },
                      fontWeight: 500
                    }}
                  />
                  <IconButton
                    onClick={handleOpenMenu}
                    sx={{
                      p: 0,
                      '&:focus': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 2
                      }
                    }}
                  >
                    <Avatar
                      src={user.avatarUrl || '/images/avatars/default.svg'}
                      alt=""
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleOpenProfile}>
                      Your Profile
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(); signOut(); }}>
                      Sign out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    component={Link}
                    href="/login"
                    variant="text"
                    sx={{
                      borderRadius: '9999px',
                      color: 'text.primary'
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    sx={{
                      borderRadius: '9999px',
                      bgcolor: 'purple.600',
                      '&:hover': {
                        bgcolor: 'purple.700'
                      }
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {user && (
        <UserProfileModal
          open={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  )
} 