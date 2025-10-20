import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Container,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Logo from "../icons/Logo";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Navbar(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    console.log("Navbar - Current user:", user);
  }, [user]);

  // xử lí khi bấm vào tài khoản
  const handleAccountClick = () => {
    if (user) navigate("/user/profile");
    else navigate("/auth/login");
  };

  // test!!!!!!!!!!!!! hiện cái snackbar để bảo đăng nhập cái đã.
  const [openSnack, setOpenSnack] = React.useState(false);

  // hiện cái snack
  const handleCloseSnack = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnack(false);
  };

  // xử lí khi nhấn vào giỏ mượn
  const handleCartClick = () => {
    if (user) navigate("/cart");
    else setOpenSnack(true);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#3F3D85",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mr: 4,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <Logo />
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  display: { xs: "none", sm: "block" },
                  marginLeft: 2,
                  letterSpacing: "0.015em",
                }}
              >
                THƯ VIỆN TRỰC TUYẾN HBH
              </Typography>
            </Box>

            {/* thanh tìm kiếm, chỗ này để tạm thế này đi */}
            <TextField
              placeholder="Tìm kiếm sách"
              size="small"
              sx={{
                flexGrow: 1,
                maxWidth: 400,
                mr: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "8px 12px",
                  fontSize: "0.9rem",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ color: "#999", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* nav bên phải */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2.5,
              }}
            >
              {/* giỏ mượn */}
              <Box
                onClick={handleCartClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                <Box
                  sx={{
                    height: "1em",
                    display: "flex",
                    alignItems: "center",
                    transform: "translateY(1px)",
                  }}
                >
                  <LocalMallOutlinedIcon
                    sx={{ fontSize: 18, color: "white" }}
                  />
                </Box>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    display: { xs: "none", sm: "block" },
                    position: "relative",
                    top: "2px",
                  }}
                >
                  GIỎ MƯỢN
                </Typography>
              </Box>

              {/* chia mấy thằng này ra */}
              <Box
                sx={{
                  width: "1px",
                  height: "18px",
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              />

              {/* yêu thích */}
              <Box
                onClick={() => navigate("/favorites")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                <Box
                  sx={{
                    height: "1em",
                    display: "flex",
                    alignItems: "center",
                    transform: "translateY(1px)",
                  }}
                >
                  <FavoriteBorderRoundedIcon
                    sx={{ fontSize: 18, color: "white" }}
                  />
                </Box>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    display: { xs: "none", sm: "block" },
                    position: "relative",
                    top: "1px",
                  }}
                >
                  YÊU THÍCH
                </Typography>
              </Box>

              {/* thanh chia */}
              <Box
                sx={{
                  width: "1px",
                  height: "18px",
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              />

              {/* tài khoản */}
              <Box
                onClick={handleAccountClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                <Box
                  sx={{
                    height: "1em",
                    display: "flex",
                    alignItems: "center",
                    transform: "translateY(1px)",
                  }}
                >
                  <PersonOutlineRoundedIcon
                    sx={{ fontSize: 18, color: "white" }}
                  />
                </Box>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    display: { xs: "none", sm: "block" },
                    position: "relative",
                    top: "2px",
                  }}
                >
                  {user ? user.full_name : "TÀI KHOẢN"}
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Vui lòng đăng nhập để xem giỏ mượn!
        </Alert>
      </Snackbar>
    </>
  );
}
