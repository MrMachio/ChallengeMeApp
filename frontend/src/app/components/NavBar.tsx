"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";

import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import ProfileModal from "./ProfileModal";

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [username, setUsername] = useState("John Smith");
  const [avatar, setAvatar] = useState<string>("/user.jpg");
  const handleLoginOpen = () => {
    setOpenSignUp(false);
    setOpenLogin(true);
  };
  const handleLoginClose = () => setOpenLogin(false);
  const handleSignUpOpen = () => {
    setOpenLogin(false);
    setOpenSignUp(true);
  };
  const handleSignUpClose = () => setOpenSignUp(false);
  const handleProfileClose = () => setOpenProfile(false);

  const handleLoginSuccess = (user?: { username: string; avatar?: string }) => {
    setIsAuthenticated(true);
    setOpenLogin(false);
    setOpenSignUp(false);
    if (user?.username) setUsername(user.username);
    if (user?.avatar) setAvatar(user.avatar);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleProfileClose();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          px: 3,
          py: 1,
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                backgroundColor: "#2196f3",
                borderRadius: 2,
                padding: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppSettingsAltIcon sx={{ color: "white", fontSize: 32 }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={22} sx={{ letterSpacing: 1, color: "#2196f3" }}>
                Challenge Me
              </Typography>
              <Typography variant="body2" color="gray" sx={{ fontSize: 15 }}>
                Take on challenges, achieve goals
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<StarIcon />}
              sx={{
                background: "linear-gradient(to right, #fbc02d, #ff9800)",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: 600,
                color: "white",
                px: 2,
                "&:hover": {
                  background: "linear-gradient(to right, #f9a825, #fb8c00)",
                },
              }}
            >
              0
            </Button>

            {isAuthenticated ? (
              <Avatar
                alt={username}
                src={avatar}
                onClick={() => setOpenProfile(true)}
                sx={{ cursor: "pointer" }}
              />
            ) : (
              <Button onClick={handleLoginOpen} variant="outlined">
                Log In
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <LoginModal
        open={openLogin}
        onClose={handleLoginClose}
        onSignUpClick={handleSignUpOpen}
        onLoginSuccess={(user) => handleLoginSuccess(user)}
      />

      <SignUpModal
        open={openSignUp}
        onClose={handleSignUpClose}
        onLoginClick={handleLoginOpen}
        onSignUpSuccess={(user) => handleLoginSuccess(user)}
      />

      <ProfileModal
        open={openProfile}
        onClose={handleProfileClose}
        onLogout={handleLogout}
        username={username}
        avatar={avatar}
        setAvatar={setAvatar}
      />
    </>
  );
}
