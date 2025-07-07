import { Box, Typography, Button, TextField, Stack, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

interface AddFriendModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (username: string) => void;
}

export default function AddFriendModal({ open, onClose, onAdd }: AddFriendModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    setError("");
    onAdd(username);
    setUsername("");
    onClose();
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.3)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          minWidth: 320,
          boxShadow: 24,
        }}
        onClick={e => e.stopPropagation()}
      >
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#2196f3" }}>
            <AddIcon />
          </Avatar>
          <Typography fontWeight="bold" color="#222" fontSize={20}>
            Add a Friend
          </Typography>
          <TextField
            label={<span style={{ color: '#222', fontWeight: 500 }}>Friend's Username</span>}
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
            InputLabelProps={{ style: { color: '#222', fontWeight: 500 } }}
            inputProps={{ style: { color: '#222', fontWeight: 500, fontSize: 16 } }}
          />
          <Button variant="contained" onClick={handleAdd} fullWidth>
            Add
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}