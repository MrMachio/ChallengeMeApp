"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import AddFriendModal from "./AddFriendModal";
import UserProfileModal from "./UserProfileModal";

interface Friend {
  name: string;
  points: number;
  online: boolean;
  avatar: string;
}

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  username: string;
  avatar: string;
  setAvatar: (avatar: string) => void;
}

const dummyFriends = [
  {
    name: "Anna Smith",
    points: 2340,
    online: true,
    avatar: "/user.jpg",
  },
  {
    name: "John Doe",
    points: 1890,
    online: false,
    avatar: "/user.jpg",
  },
  {
    name: "Maria Garcia",
    points: 3120,
    online: true,
    avatar: "/user.jpg",
  },
];

export default function ProfileModal(props: ProfileModalProps) {
  const { open, onClose, onLogout, username, avatar, setAvatar } = props;
  const [friends, setFriends] = useState(dummyFriends);
  const [viewUser, setViewUser] = useState<null | Friend>(null);
  const [points] = useState(1540);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 6,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 24,
            overflowY: "auto",
            maxHeight: "90vh",
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <Button onClick={onClose} sx={{ minWidth: 0, color: '#222', fontSize: 32, fontWeight: 700, lineHeight: 1, background: 'none', borderRadius: 0, width: 32, height: 32, p: 0, boxShadow: 'none', '&:hover': { background: 'none', color: '#000' } }} aria-label="Close">
              ×
            </Button>
          </Box>
          <Box
            sx={{
              background: "linear-gradient(135deg, #6ec6ff 0%, #1565c0 100%)",
              color: "white",
              p: 3,
              textAlign: "center",
            }}
          >
            <Avatar
              src={avatar}
              sx={{ width: 80, height: 80, mx: "auto", mb: 1, cursor: 'pointer' }}
            />
            <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
              <Typography fontWeight="bold" fontSize={24}>
                {username}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1, color: 'white', borderColor: 'white', '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.1)' } }}
                component="label"
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setAvatar(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
            </Box>
            <Typography fontSize={18}>
              {points} points
            </Typography>
            <Box mt={2} mb={-1}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f5f8fa',
                  borderRadius: 2,
                  p: '3px',
                  width: '100%',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                {['Friends', 'Active', 'Completed', 'Created'].map((tab, idx) => (
                  <Box
                    key={tab}
                    onClick={() => setSelectedTab(idx)}
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      py: 1.2,
                      cursor: 'pointer',
                      borderRadius: 1.5,
                      background: selectedTab === idx ? '#fff' : 'transparent',
                      fontWeight: selectedTab === idx ? 'bold' : 'normal',
                      color: selectedTab === idx ? '#222' : '#5a6e7a',
                      fontSize: selectedTab === 0 ? 18 : 17,
                      boxShadow: selectedTab === idx ? '0 1px 4px #e0e0e0' : 'none',
                      border: selectedTab === idx ? '1.5px solid #e0e0e0' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontWeight: selectedTab === idx ? 'bold' : 'normal', fontSize: selectedTab === idx ? 18 : 17 }}>{tab}</span>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box p={3}>
            {selectedTab === 0 && (
              <>
                <Stack spacing={2}>
                  {friends.map((friend, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={friend.avatar} />
                        <Box>
                          <Typography fontWeight="bold">{friend.name}</Typography>
                          <Typography fontSize={13} color="text.secondary">
                            {friend.points} points
                          </Typography>
                        </Box>
                      </Stack>
                      <Button size="small" variant="outlined" onClick={() => setViewUser(friend)}>
                        View
                      </Button>
                    </Paper>
                  ))}
                </Stack>

                <Box
                  mt={3}
                  sx={{
                    border: "1px dashed #ccc",
                    borderRadius: 2,
                    textAlign: "center",
                    p: 3,
                    color: "#777",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    '&:hover': { background: '#f5f5f5' },
                  }}
                  onClick={() => setAddFriendOpen(true)}
                >
                  <Typography fontSize={32} color="#2196f3">+</Typography>
                  <Typography fontWeight="bold">Add Friend</Typography>
                  <Typography variant="body2">
                    Find new friends to challenge!
                  </Typography>
                </Box>

                {addFriendOpen && (
                  <AddFriendModal
                    open={addFriendOpen}
                    onClose={() => setAddFriendOpen(false)}
                    onAdd={(username: string) => {
                      setFriends((prev) => [
                        ...prev,
                        {
                          name: username,
                          points: 0,
                          online: false,
                          avatar: "/user.jpg",
                        },
                      ]);
                    }}
                  />
                )}
              </>
            )}
            {selectedTab === 1 && null}
            {selectedTab === 2 && null}
            {selectedTab === 3 && null}
          </Box>
          <Divider />
          <Box textAlign="center" p={2}>
            <Button
              color="error"
              onClick={onLogout}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </Modal>
      {viewUser && (
        <UserProfileModal
          open={!!viewUser}
          onClose={() => setViewUser(null)}
          user={{
            username: viewUser.name,
            avatar: viewUser.avatar,
            points: viewUser.points,
            friends: friends.filter(f => f.name !== viewUser.name),
          }}
        />
      )}
    </>
  );
}
