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
import { useThemeMode } from "../../shared/hooks/useThemeMode";
import { useBookSearch } from "../../shared/hooks/useBookSearch";
import SearchResultsPanel from "./SearchResultsPanel";
import NotificationBell from "./NotificationBell";
import Logo from "../../shared/ui/icons/Logo";
import CartBadge from "../../shared/components/CartBadge";
import {
  Heart,
  ShoppingBag,
  UserRound,
  Moon,
  Sun,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "../../features/borrow/components/hooks/useCart";
import { useCurrentUser } from "../../features/users/hooks/useUser";
import { useFavourites } from "../../features/favourites/hooks/useFavourites";

export default function Navbar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const { mode, toggleTheme } = useThemeMode();
  const { data: borrowCart } = useCart(!!user);
  const { favourites } = useFavourites();
  const isMobile = useMediaQuery("(max-width:700px)");

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

  const handleFavouriteClick = () => {
    if (user) navigate("/favorites");
    else
      navigate("/auth/login", {
        state: { from: { pathname: "/favorites" } },
      });
    setDrawerOpen(false);
  };

  const handleCartClick = () => {
    if (user) navigate("/borrow/cart");
    else
      navigate("/auth/login", {
        state: { from: { pathname: "/borrow/cart" } },
      });
    setDrawerOpen(false);
  };

  const handleAccountClick = () => {
    if (user) navigate("/user/profile");
    else navigate("/auth/login");
    setDrawerOpen(false);
  };

  const handleAdminClick = () => {
    if (user?.role === "MODERATOR") {
      navigate("/admin/forum/pending-posts");
    } else {
      navigate("/admin/dashboard");
    }
    setDrawerOpen(false);
  };

  const isAdminOrLibrarian =
    user &&
    (user.role === "ADMIN" ||
      user.role === "LIBRARIAN" ||
      user.role === "MODERATOR");

  const cartBadgeValue = React.useMemo(() => {
    if (!user) return undefined;

    return borrowCart && borrowCart.totalBooks > 0
      ? borrowCart.totalBooks
      : undefined;
  }, [borrowCart, user]);

  const favouriteBadgeValue = React.useMemo(() => {
    if (!user) return undefined;

    return favourites && favourites.length > 0 ? favourites.length : undefined;
  }, [favourites, user]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length >= 2) {
      e.preventDefault();
      handleSearch();
      setIsOpen(false);
      const searchQuery = query.trim();
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
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        aria-label="Xóa tìm kiếm"
                      >
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
                aria-label="Mở menu"
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
                  aria-label={
                    mode === "light"
                      ? "Chuyển sang chế độ tối"
                      : "Chuyển sang chế độ sáng"
                  }
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
                  ...(isAdminOrLibrarian
                    ? [
                        {
                          label: "Quản trị",
                          icon: <LayoutDashboard size={19} />,
                          onClick: handleAdminClick,
                        },
                      ]
                    : []),
                  {
                    label: "Giỏ mượn",
                    icon: <ShoppingBag size={19} />,
                    onClick: handleCartClick,
                    badge: cartBadgeValue,
                  },
                  {
                    label: "Yêu thích",
                    icon: <Heart size={20} />,
                    onClick: handleFavouriteClick,
                    badge: favouriteBadgeValue,
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
                        position: "relative",
                        "&:hover": {
                          bgcolor:
                            mode === "light"
                              ? "rgba(99,102,241,0.08)"
                              : "rgba(129,140,248,0.12)",
                        },
                      }}
                    >
                      {item.badge ? (
                        <CartBadge count={item.badge}>{item.icon}</CartBadge>
                      ) : (
                        item.icon
                      )}
                      <Typography
                        sx={{
                          color: "text.primary",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    {i < (isAdminOrLibrarian ? 2 : 1) && (
                      <Box
                        sx={{ width: "1px", height: 18, bgcolor: "divider" }}
                      />
                    )}
                  </React.Fragment>
                ))}

                {user && (
                  <>
                    <Box
                      sx={{ width: "1px", height: 18, bgcolor: "divider" }}
                    />
                    <NotificationBell />
                  </>
                )}

                <Box sx={{ width: "1px", height: 18, bgcolor: "divider" }} />

                <Box
                  onClick={handleAccountClick}
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
                    position: "relative",
                    "&:hover": {
                      bgcolor:
                        mode === "light"
                          ? "rgba(99,102,241,0.08)"
                          : "rgba(129,140,248,0.12)",
                    },
                  }}
                >
                  {user ? (
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
                    />
                  ) : (
                    <UserRound size={20} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      fontWeight: 500,
                      color: "text.primary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: user ? 140 : "auto",
                    }}
                  >
                    {user ? user.full_name : "Tài khoản"}
                  </Typography>
                </Box>
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
            {/* Notification */}
            {user && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 1.5,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "text.primary" }}>
                    <NotificationBell />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thông báo"
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

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

            {isAdminOrLibrarian && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleAdminClick}>
                  <ListItemIcon sx={{ color: "text.primary", minWidth: 40 }}>
                    <LayoutDashboard size={19} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trang quản trị"
                    sx={{
                      "& .MuiTypography-root": {
                        color: "text.primary",
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

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
                {(cartBadgeValue ?? 0) > 0 && (
                  <Box
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      borderRadius: "12px",
                      px: 0.75,
                      py: 0.25,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      minWidth: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    {cartBadgeValue}
                  </Box>
                )}
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
                {(favouriteBadgeValue ?? 0) > 0 && (
                  <Box
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      borderRadius: "12px",
                      px: 0.75,
                      py: 0.25,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      minWidth: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    {favouriteBadgeValue}
                  </Box>
                )}
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
    </>
  );
}
