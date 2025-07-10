"use client";
import { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useAuth } from "@/lib/providers/AuthProvider";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onSignUpClick,
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      setError("");
      await signIn(username, password);
      setUsername("");
      setPassword("");
      onClose();
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" align="center" fontWeight={600}>
          Log In
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Stack spacing={1} mt={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              background: "linear-gradient(to right, #2196f3, #21cbf3)",
              "&:hover": {
                background: "linear-gradient(to right, #1976d2, #21cbf3)",
              },
            }}
          >
            Log In
          </Button>

          <Button variant="text" onClick={onSignUpClick}>
            Don’t have an account? Sign up
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}