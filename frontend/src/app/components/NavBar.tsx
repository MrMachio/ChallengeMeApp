import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import StarIcon from "@mui/icons-material/Star";
import { Button, Stack } from "@mui/material";
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';

export default function NavBar() {
  return (
    <AppBar
      position="static"
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
    backgroundColor: "#8e24aa",
    borderRadius: 2,
    p: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <AppSettingsAltIcon sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={22} sx={{ letterSpacing: 1 }}>Challenge Me</Typography>
            <Typography variant="body2" color="gray" sx={{ fontSize: 15 }}>
              Приемай предизвикателства, постигай цели
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
            2100
          </Button>
          <Avatar alt="User" src="/user.jpg" />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
