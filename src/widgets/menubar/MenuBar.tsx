import * as React from "react";
import {
  Box,
  Container,
  Button,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

export default function MenuBar(): React.ReactElement {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:700px)");
  const [hidden, setHidden] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (latest > previous && latest > 100) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  // nav item đây
  const menuItems = [
    { label: "TRANG CHỦ", path: "/" },
    { label: "DANH MỤC SÁCH", path: "/catalog" },
    { label: "DỊCH VỤ", path: "/services" },
    { label: "TIN TỨC & SỰ KIỆN", path: "/news" },
    { label: "VỀ CHÚNG TÔI", path: "/about" },
    { label: "LIÊN HỆ", path: "/contact" },
    { label: "DIỄN ĐÀN", path: "/forum" },
  ];

  const handleMenuItemClick = () => {
    setTimeout(() => {
      setDrawerOpen(false);
    }, 180);
  };

  return (
    <>
      <Box
        component={motion.div}
        animate={{
          y: hidden ? -100 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        sx={{
          position: "sticky",
          top: 64,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 0.5,
          zIndex: 999,
          display: { xs: "none", md: "block" },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <React.Fragment key={item.path}>
                  <Button
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive ? "primary.main" : "text.primary",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.80rem",
                        md: "0.85rem",
                        lg: "0.90rem",
                      },
                      textTransform: "none",
                      px: { xs: 2.2, sm: 2.6, md: 3.2 },
                      py: { xs: 1, sm: 1.2 },
                      minWidth: "auto",
                      borderRadius: 1.5,
                      lineHeight: 1.5,
                      letterSpacing: "-0.01em",
                      // Loại bỏ transition cho color để chuyển ngay lập tức
                      transition:
                        "background-color 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        color: "primary.main",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  {index < menuItems.length - 1 && (
                    <Box
                      sx={{
                        width: "1px",
                        height: "16px",
                        bgcolor: "divider",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* fab ở mobile */}
      <Fab
        color="primary"
        size="medium"
        aria-label="menu"
        onClick={() => setDrawerOpen(true)}
        disableRipple
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          display: isMobile ? "flex" : "none",
          zIndex: 1000,
          opacity: drawerOpen ? 0 : 1,
          visibility: drawerOpen ? "hidden" : "visible",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          pointerEvents: drawerOpen ? "none" : "auto",
          touchAction: "manipulation",
          boxShadow: 3,
          "&:active": {
            boxShadow: 1,
          },
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <MenuIcon sx={{ color: "primary.contrastText" }} />
      </Fab>

      {/* menu kéo ở mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        disableScrollLock
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
          disableEnforceFocus: true,
          disableAutoFocus: true,
        }}
        sx={{
          display: isMobile ? "block" : "none",
          "& .MuiDrawer-paper": {
            width: "70vw",
            maxWidth: 260,
            bgcolor: "background.paper",
            borderRadius: "0 8px 8px 0",
            boxSizing: "border-box",
          },
          "& .MuiBackdrop-root": {
            position: "fixed",
          },
          "& .MuiModal-root": {
            position: "fixed",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(4px)",
            },
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* phần header */}
          <Box
            sx={{
              pt: 2.5,
              pb: 1.5,
              px: 3,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
                ml: 0.5,
              }}
            >
              MENU
            </Typography>
          </Box>

          {/* item của menu */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <List sx={{ pt: 1 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      onClick={handleMenuItemClick}
                      sx={{
                        py: 1.5,
                        px: 3,
                        // Loại bỏ transition cho color và borderColor
                        transition: "background-color 0.2s ease",
                        bgcolor: isActive ? "action.hover" : "transparent",
                        borderLeft: 3,
                        borderColor: isActive ? "primary.main" : "transparent",
                        "&:hover": {
                          bgcolor: "action.hover",
                          borderColor: isActive
                            ? "primary.main"
                            : "action.hover",
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        sx={{
                          "& .MuiTypography-root": {
                            color: isActive ? "primary.main" : "text.primary",
                            fontWeight: isActive ? 600 : 500,
                            fontSize: "0.9rem",
                            letterSpacing: "-0.01em",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* footer */}
          <Box
            sx={{
              py: 2,
              px: 3,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                display: "block",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Thư viện trực tuyến HBH
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                display: "block",
                textAlign: "center",
                mt: 0.5,
              }}
            >
              © 2025 All rights reserved
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
