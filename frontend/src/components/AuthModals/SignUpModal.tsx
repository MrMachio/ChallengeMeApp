"use client";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from '@/lib/providers/AuthProvider';

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function SignUpModal({
  open,
  onClose,
  onLoginClick,
}: SignUpModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      // Try to sign up with the auth provider
      // signUp expects (email, password, username, firstName?, lastName?)
      await signUp(email, password, username, firstName || undefined, lastName || undefined);
      
      // Clear form
      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
      onClose();
    } catch (err) {
      setError("Failed to create account. Username or email might already exist.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          bgcolor: "background.paper",
          borderRadius: 2,
          padding: 5,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: -2, mt: -2 }}>
          <Button 
            onClick={onClose} 
            sx={{ 
              minWidth: 0, 
              color: "grey.700", 
              fontSize: 24, 
              fontWeight: 700, 
              lineHeight: 1 
            }} 
            aria-label="Close"
            data-testid="signup-close-button"
          >
            ×
          </Button>
        </Box>
        <Typography variant="h6" textAlign="center" fontWeight={700} color="text.primary">
          Sign Up
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username *"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          data-testid="signup-username-input"
        />

        <TextField
          label="Password *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          data-testid="signup-password-input"
        />

        <TextField
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          data-testid="signup-email-input"
        />

        <TextField
          label="First Name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          data-testid="signup-firstname-input"
        />

        <TextField
          label="Last Name (optional)"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          data-testid="signup-lastname-input"
        />

        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit}
          data-testid="signup-submit-button"
          sx={{
            background: "linear-gradient(to right, #2196f3, #21cbf3)",
            "&:hover": {
              background: "linear-gradient(to right, #1976d2, #21cbf3)",
            },
          }}
        >
          Sign Up
        </Button>

        <Button onClick={onLoginClick} data-testid="login-link-button">
          Already have an account? Log in
        </Button>
      </Box>
    </Modal>
  );
} 