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

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onSignUpSuccess: (user: { username: string; avatar?: string }) => void;
}

export default function SignUpModal({
  open,
  onClose,
  onLoginClick,
  onSignUpSuccess,
}: SignUpModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setError("A valid email address is required.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to sign up.");
      }

      const user = await response.json();

      // Optional: If tokens are returned by backend, store them
      if (user.accessToken && user.refreshToken) {
        localStorage.setItem("accessToken", user.accessToken);
        localStorage.setItem("refreshToken", user.refreshToken);
      }

      onSignUpSuccess({ username: user.username });
      onClose();
      setError("");

      // Clear the form
      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up.");
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
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </Button>
        </Box>
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight={700}
          color="text.primary"
        >
          Sign Up
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username *"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="First Name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Last Name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
        />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Sign Up
        </Button>

        <Button onClick={onLoginClick}>
          Already have an account? Log in
        </Button>
      </Box>
    </Modal>
  );
}
