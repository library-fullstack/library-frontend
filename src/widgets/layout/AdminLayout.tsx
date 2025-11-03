import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useThemeMode } from "../../shared/hooks/useThemeMode";
import { useZoomLevel } from "../../shared/hooks/useZoomLevel";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const authContext = React.useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout || (() => {});
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { isZoomed } = useZoomLevel();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const drawerWidth = 260;
  const miniDrawerWidth = 72;

  React.useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  React.useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      };
    }
  }, [isMobile, mobileOpen]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate("/user/profile");
    handleMenuClose();
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "calc(var(--vh, 1vh) * 100)" }}
      className={`admin-layout-container ${isZoomed ? "zoom-compact" : ""}`}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon style={{ marginLeft: 4 }} size={24} />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={toggleTheme}
            sx={{
              mr: 2,
              width: 40,
              height: 40,
              color: "text.primary",
            }}
          >
            {mode === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>

          <Box
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Box
              sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ lineHeight: 1.2 }}
              >
                {user?.full_name || "Admin"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role === "ADMIN" ? "Quản trị viên" : "Thủ thư"}
              </Typography>
            </Box>
            <Avatar
              src={user?.avatar_url || ""}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              {user?.full_name?.charAt(0).toUpperCase() || "A"}
            </Avatar>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            disableScrollLock
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: theme.shadows[8],
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {user?.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile} sx={{ gap: 1.5, py: 1 }}>
              <User size={18} />
              Trang cá nhân
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, py: 1 }}>
              <Settings size={18} />
              Cài đặt
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ gap: 1.5, py: 1, color: "error.main" }}
            >
              <LogOut size={18} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <AdminSidebar
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth}
        mobileOpen={mobileOpen}
        sidebarOpen={sidebarOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          bgcolor: "background.default",
          minHeight: "calc(var(--vh, 1vh) * 100)",
          overflowX: "auto",
          overflowY: "hidden",
          transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1) 150ms",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            width: "100%",
            minHeight: "calc(100vh - 64px)",
            overflowX: "auto",
            overflowY: "hidden",
            p: { xs: 1.5, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;
