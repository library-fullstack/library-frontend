import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Divider,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  BarChart3,
  Settings,
  Tag,
  // Building2,
  ArrowLeft,
  Image,
  Activity,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Lock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../shared/ui/icons/Logo";
import { useCurrentUser } from "../../features/users/hooks/useUser";

interface AdminSidebarProps {
  drawerWidth: number;
  miniDrawerWidth: number;
  mobileOpen: boolean;
  sidebarOpen: boolean;
  handleDrawerToggle: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path?: string;
  roles: string[];
  subItems?: MenuItem[];
}

export default function AdminSidebar({
  drawerWidth,
  miniDrawerWidth,
  mobileOpen,
  sidebarOpen,
  handleDrawerToggle,
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const isCollapsed = !sidebarOpen;

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const menuItems: MenuItem[] = [
    {
      title: "Tổng quan",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
      roles: ["ADMIN", "LIBRARIAN"],
    },
    {
      title: "Quản lý sách",
      icon: <BookOpen size={20} />,
      path: "/admin/books",
      roles: ["ADMIN", "LIBRARIAN"],
    },
    {
      title: "Quản lý mượn trả",
      icon: <BookMarked size={20} />,
      path: "/admin/borrows",
      roles: ["ADMIN", "LIBRARIAN"],
    },
    {
      title: "Quản lý người dùng",
      icon: <Users size={20} />,
      path: "/admin/users",
      roles: ["ADMIN"],
    },
    {
      title: "Thống kê & Báo cáo",
      icon: <BarChart3 size={20} />,
      path: "/admin/analytics",
      roles: ["ADMIN"],
    },
    {
      title: "Quản lý Banner",
      icon: <Image size={20} />,
      path: "/admin/banners",
      roles: ["ADMIN", "LIBRARIAN"],
    },
    {
      title: "Tin tức & Sự kiện",
      icon: <MessageSquare size={20} />,
      path: "/admin/content",
      roles: ["ADMIN", "LIBRARIAN"],
    },
    {
      title: "Giám sát hiệu suất",
      icon: <Activity size={20} />,
      path: "/admin/performance",
      roles: ["ADMIN", "LIBRARIAN"],
    },
    {
      title: "Diễn đàn",
      icon: <MessageSquare size={20} />,
      roles: ["ADMIN", "MODERATOR"],
      subItems: [
        {
          title: "Bài viết chờ duyệt",
          icon: <MessageSquare size={16} />,
          path: "/admin/forum/pending-posts",
          roles: ["ADMIN", "MODERATOR"],
        },
        {
          title: "Báo cáo vi phạm",
          icon: <AlertCircle size={16} />,
          path: "/admin/forum/reports",
          roles: ["ADMIN", "MODERATOR"],
        },
        {
          title: "Nhật ký hoạt động",
          icon: <Activity size={16} />,
          path: "/admin/forum/activity-logs",
          roles: ["ADMIN", "MODERATOR"],
        },
        {
          title: "Quản lý chủ đề",
          icon: <Tag size={16} />,
          path: "/admin/forum/categories",
          roles: ["ADMIN"],
        },
        {
          title: "Cài đặt diễn đàn",
          icon: <Settings size={16} />,
          path: "/admin/forum/settings",
          roles: ["ADMIN"],
        },
      ],
    },
  ];

  // Check if user has access to a menu item
  const hasAccess = (item: MenuItem) => {
    return item.roles.includes(user?.role || "");
  };

  const handleNavigation = (path: string, item: MenuItem) => {
    if (!hasAccess(item)) {
      return; // Don't navigate if no access
    }
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: isCollapsed ? 2 : 3,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 80,
          flexShrink: 0,
          overflow: "hidden",
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Logo width={30} sx={{ mb: 0.7, flexShrink: 0 }}></Logo>
        {!isCollapsed && (
          <Box sx={{ minWidth: 0, overflow: "hidden" }}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ lineHeight: 1.2, whiteSpace: "nowrap" }}
            >
              Thư viện
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              Quản trị hệ thống
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <List
          sx={{
            px: 2,
            py: 2,
            transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {menuItems.map((item) => {
            const isExpanded = expandedItems.includes(item.title);
            const isActive = location.pathname === item.path;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const hasAccessToItem = hasAccess(item);

            const button = (
              <ListItemButton
                onClick={() => {
                  if (!hasAccessToItem) return;
                  if (hasSubItems) {
                    toggleExpand(item.title);
                  } else {
                    handleNavigation(item.path!, item);
                  }
                }}
                disabled={!hasAccessToItem}
                disableRipple
                sx={{
                  borderRadius: 2,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  alignItems: "center",
                  gap: isCollapsed ? 0 : 1.5,
                  px: isCollapsed ? 0 : 2,
                  py: isCollapsed ? 0 : 1.25,
                  minHeight: isCollapsed ? 0 : 44,
                  opacity: hasAccessToItem ? 1 : 0.5,
                  cursor: hasAccessToItem ? "pointer" : "not-allowed",
                  bgcolor: isActive
                    ? theme.palette.mode === "dark"
                      ? "rgba(129, 140, 248, 0.15)"
                      : "rgba(79, 70, 229, 0.08)"
                    : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  fontWeight: isActive ? 600 : 400,
                  transition:
                    "all 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
                  "&:hover": hasAccessToItem
                    ? {
                        bgcolor: isActive
                          ? theme.palette.mode === "dark"
                            ? "rgba(129, 140, 248, 0.25)"
                            : "rgba(79, 70, 229, 0.12)"
                          : theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.04)",
                      }
                    : {},

                  ...(isCollapsed && {
                    width: 45,
                    height: 42,
                    minHeight: "unset",
                    p: 0,
                    m: "4px auto",
                    borderRadius: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover": hasAccessToItem
                      ? {
                          transform: "scale(1.05)",
                        }
                      : {},
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    color: isActive ? "primary.main" : "text.secondary",
                    justifyContent: "center",
                    transition: "color 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    ...(isCollapsed && {
                      m: 0,
                    }),
                  }}
                >
                  {!hasAccessToItem ? <Lock size={20} /> : item.icon}
                </ListItemIcon>

                {!isCollapsed && (
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 600 : 500,
                        noWrap: true,
                      }}
                    />
                    {hasSubItems && (
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Box>
                )}
              </ListItemButton>
            );

            return (
              <Box key={item.title} sx={{ mb: 0.5 }}>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 0.5,
                    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {isCollapsed ? (
                    <Tooltip
                      title={
                        hasAccessToItem
                          ? item.title
                          : `${item.title} - Bạn không có quyền truy cập`
                      }
                      placement="right"
                      arrow
                    >
                      {button}
                    </Tooltip>
                  ) : !hasAccessToItem ? (
                    <Tooltip
                      title="Bạn không có quyền truy cập tính năng này"
                      placement="top"
                      arrow
                    >
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  )}
                </ListItem>

                {hasSubItems && !isCollapsed && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List sx={{ pl: 2, pt: 0.5, pb: 0.5 }}>
                      {item.subItems?.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;
                        const hasSubAccess = hasAccess(subItem);
                        const subButton = (
                          <ListItemButton
                            onClick={() =>
                              hasSubAccess &&
                              handleNavigation(subItem.path!, subItem)
                            }
                            disabled={!hasSubAccess}
                            disableRipple
                            sx={{
                              borderRadius: 1.5,
                              pl: 2,
                              pr: 2,
                              py: 0.75,
                              minHeight: 36,
                              opacity: hasSubAccess ? 1 : 0.5,
                              cursor: hasSubAccess ? "pointer" : "not-allowed",
                              bgcolor: isSubActive
                                ? theme.palette.mode === "dark"
                                  ? "rgba(129, 140, 248, 0.1)"
                                  : "rgba(79, 70, 229, 0.05)"
                                : "transparent",
                              color: isSubActive
                                ? "primary.main"
                                : "text.secondary",
                              fontWeight: isSubActive ? 500 : 400,
                              "&:hover": hasSubAccess
                                ? {
                                    bgcolor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(129, 140, 248, 0.08)"
                                        : "rgba(79, 70, 229, 0.04)",
                                  }
                                : {},
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 28,
                                color: isSubActive
                                  ? "primary.main"
                                  : "text.secondary",
                              }}
                            >
                              {!hasSubAccess ? (
                                <Lock size={16} />
                              ) : (
                                subItem.icon
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.title}
                              primaryTypographyProps={{
                                fontSize: "0.8125rem",
                                fontWeight: isSubActive ? 500 : 400,
                                noWrap: true,
                              }}
                            />
                          </ListItemButton>
                        );

                        return (
                          <ListItem
                            key={subItem.path}
                            disablePadding
                            sx={{ mb: 0.25 }}
                          >
                            {!hasSubAccess ? (
                              <Tooltip
                                title="Bạn không có quyền truy cập"
                                placement="right"
                                arrow
                              >
                                {subButton}
                              </Tooltip>
                            ) : (
                              subButton
                            )}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ flexShrink: 0 }} />

      <List sx={{ px: 2, py: 2, flexShrink: 0 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <Tooltip
            title="Về trang chủ"
            placement="right"
            arrow
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              onClick={() => {
                navigate("/");
                if (mobileOpen) handleDrawerToggle();
              }}
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                alignItems: "center",
                gap: isCollapsed ? 0 : 1.5,
                px: isCollapsed ? 0 : 2,
                py: isCollapsed ? 0 : 1.25,
                minHeight: isCollapsed ? 0 : 44,
                display: "flex",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                },
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                ...(isCollapsed && {
                  width: 45,
                  height: 42,
                  minHeight: "unset",
                  p: 0,
                  m: "4px auto",
                  borderRadius: 1.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  ...(isCollapsed && {
                    m: 0,
                  }),
                }}
              >
                <ArrowLeft size={20} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Về trang chủ"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    noWrap: true,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            position: "fixed",
            top: { xs: 56, sm: 64 },

            maxHeight: {
              xs: "calc(100vh - 56px)",
              sm: "calc(100vh - 64px)",
            },
            bottom: 0,
            height: "auto",
            overflow: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            msOverflowStyle: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "action.disabled",
              borderRadius: "3px",
            },
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: sidebarOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarOpen ? drawerWidth : miniDrawerWidth,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            position: "fixed",
            top: 64,
            bottom: 0,
            left: 0,
            height: "calc(100vh - 64px)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            transition: "width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
