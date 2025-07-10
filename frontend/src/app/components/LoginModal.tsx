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

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { username: string; avatar?: string }) => void;
  onSignUpClick: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onLoginSuccess,
  onSignUpClick,
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Login failed.");
      }

      const data = await response.json();
      const { accessToken, refreshToken } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      onLoginSuccess({ username });
      onClose();
      setError("");
    } catch (err: any) {
      const errorMsg =
        err.message.includes("invalid_grant") || err.message.includes("credentials")
          ? "Invalid username or password."
          : err.message || "Something went wrong during login.";
      setError(errorMsg);
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
          <Button variant="contained" fullWidth onClick={handleLogin}>
            Log In
          </Button>

          <Button variant="text" onClick={onSignUpClick}>
            Don't have an account? Sign up
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}
