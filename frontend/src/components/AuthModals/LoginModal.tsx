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
  Box,
} from "@mui/material";
import { useAuth } from '@/lib/providers/AuthProvider';

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
      // Try to sign in with the auth provider
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
          data-testid="login-username-input"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="login-password-input"
        />

        <Stack spacing={1} mt={2}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogin}
            data-testid="login-submit-button"
            sx={{
              background: "linear-gradient(to right, #2196f3, #21cbf3)",
              "&:hover": {
                background: "linear-gradient(to right, #1976d2, #21cbf3)",
              },
            }}
          >
            Log In
          </Button>

          <Button variant="text" onClick={onSignUpClick} data-testid="signup-link-button">
            Don't have an account? Sign up
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
} 