
import React, {
  useState
} from "react";
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

interface Friend {
  name: string;
  points: number;
  avatar: string;
}

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    username: string;
    avatar: string;
    points: number;
    friends: Friend[];
  };
}

export default function UserProfileModal({ open, onClose, user }: UserProfileModalProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
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
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #6ec6ff 0%, #1565c0 100%)",
            color: "white",
            p: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
          />
          <Typography fontWeight="bold" fontSize={24}>
            {user.username}
          </Typography>
          <Typography fontSize={18}>
            {user.points} points
          </Typography>
          <Box mt={2} mb={-1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: '#f5f8fa',
                borderRadius: 2,
                padding: '3px',
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
            <Stack spacing={2}>
              {user.friends.map((friend, index) => (
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
                  <Button size="small" variant="outlined" disabled>
                    View
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
          {selectedTab === 1 && null}
          {selectedTab === 2 && null}
          {selectedTab === 3 && null}
        </Box>
        <Divider />
        <Box textAlign="center" p={2}>
          <Button
            onClick={onClose}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
