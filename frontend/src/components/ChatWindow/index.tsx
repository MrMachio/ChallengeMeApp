'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Stack,
  Divider,
  Menu,
  MenuItem,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '@/lib/providers/AuthProvider'
import { chatApi } from '@/lib/api/friends'
import { mockChallenges } from '@/lib/mock/data'
import type { Chat, Message, User } from '@/lib/api/friends'
import ChallengeCard from '@/components/ChallengeCard'
import ChallengeModal from '@/components/ChallengeModal'
import Filters from '@/components/Filters'
import { Category, SortConfig, ChallengeStatus } from '@/app/page'
import SearchIcon from '@mui/icons-material/Search'
import { formatTimeAgo } from '@/lib/utils'

interface ChatWindowProps {
  chat: Chat
  otherUser: User
  onClose?: () => void
  onChatUpdate?: (updatedChat: Chat) => void
}

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
}))

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  minHeight: 64,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}))

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(1),
  backgroundColor: '#f5f5f5',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '3px',
  },
}))

const MessageBubble = styled(Paper)<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: '70%',
  marginBottom: theme.spacing(1),
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  ...(isOwn && {
    borderBottomRightRadius: theme.spacing(0.5),
  }),
  ...(!isOwn && {
    borderBottomLeftRadius: theme.spacing(0.5),
  }),
}))

const ChallengeBubble = styled(Paper)<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  padding: 0,
  width: '320px', // Fixed width for consistency
  marginBottom: theme.spacing(1),
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '24px',
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
}))

const ChatInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}))



export default function ChatWindow({ chat, otherUser, onClose, onChatUpdate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages || [])
  const [inputMessage, setInputMessage] = useState('')
  const [attachMenuAnchor, setAttachMenuAnchor] = useState<null | HTMLElement>(null)
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['All Categories'])
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'none', direction: 'desc' })
  const [challengeModalOpen, setChallengeModalOpen] = useState(false)
  const [selectedChallengeForModal, setSelectedChallengeForModal] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user: currentUser } = useAuth()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update messages when chat changes
  useEffect(() => {
    setMessages(chat.messages || [])
  }, [chat])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) return

    try {
      await chatApi.sendMessage(
        chat.id,
        currentUser.id,
        inputMessage.trim()
      )
      
      // Get updated chat and notify parent
      const updatedChat = await chatApi.getOrCreateChat(currentUser.id, otherUser.id)
      onChatUpdate?.(updatedChat)
      
      setInputMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSendChallenge = async (challengeId: string) => {
    if (!currentUser) return

    const challenge = mockChallenges.find(c => c.id === challengeId)
    if (!challenge) return

    try {
      await chatApi.sendMessage(
        chat.id,
        currentUser.id,
        `Challenge: ${challenge.title}`,
        'challenge',
        challengeId
      )
      
      // Get updated chat and notify parent
      const updatedChat = await chatApi.getOrCreateChat(currentUser.id, otherUser.id)
      onChatUpdate?.(updatedChat)
      
      setChallengeDialogOpen(false)
      setSelectedChallenge(null)
    } catch (error) {
      console.error('Error sending challenge:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAttachClick = (event: React.MouseEvent<HTMLElement>) => {
    setAttachMenuAnchor(event.currentTarget)
  }

  const handleAttachClose = () => {
    setAttachMenuAnchor(null)
  }

  const handleChallengeClick = (challengeId: string, e?: React.MouseEvent) => {
    // Prevent event bubbling
    e?.stopPropagation()
    
    // Open challenge modal instead of navigating
    setSelectedChallengeForModal(challengeId)
    setChallengeModalOpen(true)
  }

  const handleChallengeSelect = (challengeId: string) => {
    // Only select the challenge, don't open modal
    setSelectedChallenge(challengeId)
  }

  // Filter challenges for modal
  const getFilteredChallenges = () => {
    let filteredChallenges = mockChallenges

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredChallenges = filteredChallenges.filter(challenge =>
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (!selectedCategories.includes('All Categories')) {
      filteredChallenges = filteredChallenges.filter(challenge => {
        // Check if "Favorites" is selected
        if (selectedCategories.includes('Favorites')) {
          const isFavorite = currentUser?.favoritesChallenges?.includes(challenge.id) || false;
          const isInOtherCategories = selectedCategories.some(cat => 
            cat !== 'Favorites' && cat === challenge.category
          );
          return isFavorite || isInOtherCategories;
        }
        return selectedCategories.includes(challenge.category as Category);
      })
    }

    // Apply status filter
    if (currentUser && selectedStatus !== 'all') {
      filteredChallenges = filteredChallenges.filter(challenge => {
        switch (selectedStatus) {
          case 'completed':
            return currentUser.completedChallenges.includes(challenge.id)
          case 'active':
            return currentUser.activeChallenges.includes(challenge.id)
          case 'created':
            return challenge.creatorId === currentUser.id
          case 'available':
            return !currentUser.completedChallenges.includes(challenge.id) && 
                   !currentUser.activeChallenges.includes(challenge.id) &&
                   challenge.creatorId !== currentUser.id
          default:
            return true
        }
      })
    }

    // Apply sorting
    if (sortConfig.field !== 'none') {
      filteredChallenges = [...filteredChallenges].sort((a, b) => {
        const multiplier = sortConfig.direction === 'desc' ? -1 : 1
        switch (sortConfig.field) {
          case 'points':
            return (a.points - b.points) * multiplier
          case 'likes':
            return (a.likesCount - b.likesCount) * multiplier
          case 'completions':
            // Ensure we have valid numbers for comparison
            const aCompletions = a.completionsCount || 0
            const bCompletions = b.completionsCount || 0
            return (aCompletions - bCompletions) * multiplier
          default:
            return 0
        }
      })
    }

    return filteredChallenges
  }

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === currentUser?.id
    const messageTime = formatTimeAgo(message.timestamp)

    if (message.type === 'challenge' && message.challengeId) {
      const challenge = mockChallenges.find(c => c.id === message.challengeId)
      if (challenge) {
        return (
          <ChallengeBubble 
            key={message.id} 
            isOwn={isOwn}
            onClick={(e) => handleChallengeClick(message.challengeId!, e)}
          >
            <ChallengeCard challenge={challenge} disableInteractions={true} />
          </ChallengeBubble>
        )
      }
    }

    return (
      <MessageBubble key={message.id} isOwn={isOwn}>
        <Typography variant="body2">
          {message.content}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontSize: '0.7rem', 
            opacity: 0.7,
            display: 'block',
            textAlign: 'right',
            mt: 0.5
          }}
        >
          {messageTime}
        </Typography>
      </MessageBubble>
    )
  }

  return (
    <ChatContainer>
      {/* Chat Header */}
      <ChatHeader>
        <Avatar
          src={otherUser.avatarUrl}
          alt={otherUser.username}
          sx={{ 
            width: 40, 
            height: 40,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => window.open(`/profile/${otherUser.username}`, '_blank')}
        />
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle1" 
            fontWeight="bold"
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            onClick={() => window.open(`/profile/${otherUser.username}`, '_blank')}
          >
            {otherUser.username}
          </Typography>
          {otherUser.fullName && (
            <Typography variant="body2" color="text.secondary">
              {otherUser.fullName}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </ChatHeader>

      {/* Messages */}
      <MessagesContainer>
        <Stack spacing={1}>
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </Stack>
      </MessagesContainer>

      {/* Chat Input */}
      <ChatInput>
        <IconButton onClick={handleAttachClick}>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          <SendIcon />
        </IconButton>
      </ChatInput>

      {/* Attach Menu */}
      <Menu
        anchorEl={attachMenuAnchor}
        open={Boolean(attachMenuAnchor)}
        onClose={handleAttachClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => {
          setChallengeDialogOpen(true)
          handleAttachClose()
        }}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Share Challenge
        </MenuItem>
      </Menu>

      {/* Challenge Selection Dialog */}
      <Dialog
        open={challengeDialogOpen}
        onClose={() => setChallengeDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            maxHeight: '90vh',
            height: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Select Challenge to Send
        </DialogTitle>
        <DialogContent sx={{ height: '100%', pb: 0, pt: 2 }}>
          {/* Filters */}
          <Box sx={{ mb: 3, mt: 2 }}>
            <Filters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              user={currentUser}
            />
          </Box>

          {/* Challenges Grid */}
          <Grid container spacing={2} sx={{ 
            height: 'calc(100% - 140px)', 
            overflow: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
            },
          }}>
            {getFilteredChallenges().map(challenge => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <Box
                  onClick={() => handleChallengeSelect(challenge.id)}
                  sx={{
                    cursor: 'pointer',
                    opacity: selectedChallenge === challenge.id ? 1 : 1,
                    transform: selectedChallenge === challenge.id ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    border: selectedChallenge === challenge.id ? '2px solid' : '2px solid transparent',
                    borderColor: selectedChallenge === challenge.id ? 'primary.main' : 'transparent',
                    borderRadius: '24px',
                    '&:hover': {
                      opacity: 1,
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <ChallengeCard challenge={challenge} disableInteractions={true} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChallengeDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedChallenge && handleSendChallenge(selectedChallenge)}
            disabled={!selectedChallenge}
            variant="contained"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Challenge Modal */}
      {selectedChallengeForModal && (
        <ChallengeModal
          challenge={mockChallenges.find(c => c.id === selectedChallengeForModal)!}
          open={challengeModalOpen}
          onClose={() => {
            setChallengeModalOpen(false)
            setSelectedChallengeForModal(null)
          }}
        />
      )}
    </ChatContainer>
  )
} 