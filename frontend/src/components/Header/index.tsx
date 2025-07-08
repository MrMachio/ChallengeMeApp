'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/AuthProvider'
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
  CircularProgress,
} from '@mui/material'
import { useState } from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LoginModal from '@/components/AuthModals/LoginModal'
import SignUpModal from '@/components/AuthModals/SignUpModal'

export default function Header() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openLogin, setOpenLogin] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenProfile = () => {
    handleCloseMenu()
    if (user?.username) {
      router.push(`/profile/${user.username}`)
    }
  }

  const handleSignOut = async () => {
    handleCloseMenu()
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleLoginOpen = () => {
    setOpenSignUp(false)
    setOpenLogin(true)
  }

  const handleSignUpOpen = () => {
    setOpenLogin(false)
    setOpenSignUp(true)
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

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                <Button
                  component={Link}
                  href="/"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Challenges
                </Button>
                <Button
                  component={Link}
                  href="/users"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Users
                </Button>
                {user && (
                  <Button
                    component={Link}
                    href={`/profile/${user.username}`}
                    sx={{
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    My Profile
                  </Button>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 40 }}>
              {loading ? (
                <CircularProgress size={24} />
              ) : user ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<EmojiEventsIcon />}
                    sx={{
                      background: "linear-gradient(to right, #fbc02d, #ff9800)",
                      borderRadius: "24px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "white",
                      px: 2,
                      py: 0.5,
                      minWidth: 0,
                      boxShadow: '0 2px 8px rgba(251, 192, 45, 0.3)',
                      "&:hover": {
                        background: "linear-gradient(to right, #f9a825, #fb8c00)",
                        boxShadow: '0 4px 12px rgba(251, 192, 45, 0.4)',
                      },
                    }}
                  >
                    {user.points}
                  </Button>
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
                    <MenuItem onClick={handleSignOut}>
                      Sign out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    onClick={handleLoginOpen}
                    variant="text"
                    sx={{
                      borderRadius: '9999px',
                      color: 'text.primary'
                    }}
                    data-testid="header-login-button"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleSignUpOpen}
                    variant="contained"
                    sx={{
                      borderRadius: '9999px',
                      background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                      }
                    }}
                    data-testid="header-signup-button"
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSignUpClick={handleSignUpOpen}
      />

      <SignUpModal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
        onLoginClick={handleLoginOpen}
      />
    </>
  )
} 