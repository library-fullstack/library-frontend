import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Container,
  IconButton,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Avatar,
} from "@mui/material";

import { Search, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import { useThemeMode } from "../../shared/hooks/useThemeMode";
import { useBookSearch } from "../../shared/hooks/useBookSearch";
import SearchResultsPanel from "./SearchResultsPanel";
import Logo from "../../shared/ui/icons/Logo";
import { Heart, ShoppingBag, UserRound, Moon, Sun, X } from "lucide-react";

export default function Navbar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery("(max-width:700px)");

  const [snack, setSnack] = React.useState<"cart" | "favorite" | null>(null);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    handleSearch,
    errorMessage,
  } = useBookSearch();

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (searchInputRef.current) setAnchorEl(searchInputRef.current);
  }, []);

  // ẩn popper khi scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, setIsOpen]);

  const showSnack = React.useCallback((type: "cart" | "favorite") => {
    setSnack(type);
    setOpenSnack(true);
  }, []);

  const handleCloseSnack = React.useCallback(
    (_?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setOpenSnack(false);
      setTimeout(() => setSnack(null), 300);
    },
    []
  );

  const handleFavouriteClick = () => {
    if (user) navigate("/favorites");
    else showSnack("favorite");
    setDrawerOpen(false);
  };

  const handleCartClick = () => {
    if (user) navigate("/cart");
    else showSnack("cart");
    setDrawerOpen(false);
  };

  const handleAccountClick = () => {
    if (user) navigate("/user/profile");
    else navigate("/auth/login");
    setDrawerOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length >= 2) {
      e.preventDefault();
      handleSearch();
      setIsOpen(false);
      const searchQuery = query.trim();
      // reset input
      setQuery("");
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSelectBook = (bookId: number) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/books/${bookId}`);
  };

  const handleViewAllResults = () => {
    if (query.trim().length >= 2) {
      setIsOpen(false);
      const searchQuery = query.trim();
      // reset input
      setQuery("");
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setIsOpen(false);
  };

  // đóng popper
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 0 },
            }}
          >
            {/* logo và tên thư viện */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mr: { xs: 0, sm: 1, md: 3 },
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: { xs: 1 },
                }}
              >
                <Logo sx={{ width: { xs: 40, sm: 40, md: 40 } }} />
              </Box>
              <Typography
                sx={{
                  color: "text.primary",
                  fontWeight: 700,
                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.90rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                  display: { xs: "none", md: "block" },
                  ml: 1,
                  letterSpacing: "-0.01em",
                  minWidth: 90,
                  flexShrink: 0,
                }}
              >
                THƯ VIỆN TRỰC TUYẾN HBH
              </Typography>
            </Box>

            {/* thanh tìm kiếm */}
            <TextField
              placeholder="Tìm kiếm sách, tác giả..."
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              inputRef={searchInputRef}
              sx={{
                flexGrow: 1,
                maxWidth: { xs: "100%", md: 550 },
                mr: { xs: 0, sm: 0, md: 2 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.default",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused": {
                    boxShadow: (theme) =>
                      `0 0 0 3px ${
                        theme.palette.mode === "light"
                          ? "rgba(99,102,241,0.1)"
                          : "rgba(129,140,248,0.15)"
                      }`,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: { xs: "7px 10px", sm: "9px 14px" },
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {query ? (
                      <IconButton size="small" onClick={handleClearSearch}>
                        <X size={18} />
                      </IconButton>
                    ) : (
                      <Search
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: 20, sm: 22 },
                        }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />

            {/* dropdown tìm kiếm */}
            <SearchResultsPanel
              results={results}
              isLoading={isLoading}
              isOpen={isOpen}
              query={query}
              onClose={() => setIsOpen(false)}
              onSelectBook={handleSelectBook}
              onViewAll={handleViewAllResults}
              anchorEl={anchorEl}
              errorMessage={errorMessage}
            />

            {/* action icon */}
            {isMobile ? (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                disableRipple
                disableFocusRipple
                sx={{
                  color: "text.primary",
                  ml: "auto",
                  pr: { xs: 0, sm: 0 },
                  borderRadius: "50%",
                  overflow: "hidden",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor:
                      mode === "light"
                        ? "rgba(99,102,241,0.08)"
                        : "rgba(129,140,248,0.12)",
                  },
                  "&:active": {
                    bgcolor: "transparent",
                  },
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: 32, sm: 34 } }} />
              </IconButton>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: "text.primary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor:
                        mode === "light"
                          ? "rgba(99,102,241,0.08)"
                          : "rgba(129,140,248,0.12)",
                    },
                  }}
                >
                  {mode === "light" ? <Moon size={22} /> : <Sun size={22} />}
                </IconButton>

                <Box sx={{ width: "1px", height: 18, bgcolor: "divider" }} />

                {[
                  // giỏ mượn, yêu thích, tài khoản
                  {
                    label: "Giỏ mượn",
                    icon: <ShoppingBag size={19} />,
                    onClick: handleCartClick,
                  },
                  {
                    label: "Yêu thích",
                    icon: <Heart size={20} />,
                    onClick: handleFavouriteClick,
                  },
                  // avatar và tải khoản
                  {
                    label: user ? user.full_name : "Tài khoản",
                    // icon: <UserRound size={20} />,
                    icon: user ? (
                      <Avatar
                        src={user.avatar_url || ""}
                        alt={user.full_name}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 13,
                          fontWeight: 600,
                          bgColor: "primary.main",
                        }}
                      ></Avatar>
                    ) : (
                      <UserRound size={20} />
                    ),
                    onClick: handleAccountClick,
                    truncate: !!user,
                  },
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    <Box
                      onClick={item.onClick}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1,
                        py: 0.6,
                        borderRadius: 1.25,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                        "&:hover": {
                          bgcolor:
                            mode === "light"
                              ? "rgba(99,102,241,0.08)"
                              : "rgba(129,140,248,0.12)",
                        },
                      }}
                    >
                      {item.icon}
                      <Typography
                        sx={{
                          color: "text.primary",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.4,
                          ...(item.truncate && {
                            maxWidth: { xs: 100, sm: 130, md: 160 },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }),
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    {i < 2 && (
                      <Box
                        sx={{ width: "1px", height: 18, bgcolor: "divider" }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        disableScrollLock
        keepMounted={false}
        ModalProps={{
          disableEnforceFocus: true,
          disableAutoFocus: true,
          disableRestoreFocus: true,
          disableScrollLock: true,
          keepMounted: false,
        }}
        sx={{
          display: isMobile ? "block" : "none",
          "& .MuiDrawer-paper": {
            width: "70vw",
            maxWidth: 260,
            bgcolor: "background.paper",
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
        <Box sx={{ pt: 2, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              px: 3,
              pb: 1.5,
              fontWeight: 700,
              color: "text.primary",
              fontSize: "1.1rem",
              borderBottom: 1,
              borderColor: "divider",
              mb: 1,
            }}
          >
            MENU
          </Typography>
          <List
            sx={{
              pl: "0.5rem",
            }}
          >
            <ListItem disablePadding>
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon sx={{ color: "text.primary", minWidth: 40 }}>
                  {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </ListItemIcon>
                <ListItemText
                  primary={mode === "light" ? "Chế độ tối" : "Chế độ sáng"}
                  sx={{
                    "& .MuiTypography-root": {
                      color: "text.primary",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleCartClick}>
                <ListItemIcon sx={{ color: "text.primary", minWidth: 40 }}>
                  <ShoppingBag size={19} />
                </ListItemIcon>
                <ListItemText
                  primary="Giỏ mượn"
                  sx={{
                    "& .MuiTypography-root": {
                      color: "text.primary",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleFavouriteClick}>
                <ListItemIcon sx={{ color: "text.primary", minWidth: 40 }}>
                  <Heart size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Yêu thích"
                  sx={{
                    "& .MuiTypography-root": {
                      color: "text.primary",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleAccountClick}>
                <ListItemIcon sx={{ color: "text.primary", minWidth: 40 }}>
                  {user ? (
                    <Avatar
                      src={user.avatar_url || ""}
                      alt={user.full_name}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: 13,
                        fontWeight: 600,
                        bgcolor: "primary.main",
                        ml: "-2px",
                      }}
                    >
                      {user.full_name?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                  ) : (
                    <UserRound size={20} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={user ? user.full_name : "Tài khoản"}
                  sx={{
                    "& .MuiTypography-root": {
                      color: "text.primary",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
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

      {/* snackbar thông báo */}
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "&.MuiSnackbar-root": {
            left: "auto !important",
            right: "24px !important",
            transform: "none !important",
            top: "20%",
            bottom: "auto",
            translate: "0 -50%",
          },
        }}
      >
        <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
          {snack === "cart"
            ? "Vui lòng đăng nhập để xem giỏ mượn!"
            : snack === "favorite"
            ? "Vui lòng đăng nhập để xem các cuốn sách yêu thích!"
            : ""}
        </Alert>
      </Snackbar>
    </>
  );
}
