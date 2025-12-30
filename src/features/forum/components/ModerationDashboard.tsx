import React, { useState } from "react";
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
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  ClipboardList,
  AlertTriangle,
  Activity,
  Bell,
  Menu,
  X,
} from "lucide-react";
import PendingPostsList from "./ModerationPendingPosts";
import ReportsList from "./ModerationReports";
import ActivityLogsList from "./ModerationActivityLogs";

type TabType = "pending" | "reports" | "logs" | "notifications";

const ModerationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "pending",
      label: "Bài cần duyệt",
      icon: <ClipboardList size={20} />,
    },
    { id: "reports", label: "Báo cáo", icon: <AlertTriangle size={20} /> },
    { id: "logs", label: "Nhật ký", icon: <Activity size={20} /> },
    { id: "notifications", label: "Thông báo", icon: <Bell size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingPostsList />;
      case "reports":
        return <ReportsList />;
      case "logs":
        return <ActivityLogsList />;
      case "notifications":
        return (
          <Box p={2}>
            <Typography>Tính năng thông báo sẽ được cập nhật</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const drawerContent = (
    <Box>
      <Box p={2} borderBottom={`1px solid ${theme.palette.divider}`}>
        <Typography variant="h6">Quản lý diễn đàn</Typography>
      </Box>
      <List>
        {tabs.map((tab) => (
          <ListItem key={tab.id} disablePadding>
            <ListItemButton
              selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileOpen(false);
              }}
              sx={{
                backgroundColor:
                  activeTab === tab.id
                    ? theme.palette.mode === "dark"
                      ? "rgba(79, 70, 229, 0.1)"
                      : "rgba(79, 70, 229, 0.08)"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(79, 70, 229, 0.15)"
                      : "rgba(79, 70, 229, 0.12)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{tab.icon}</ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box display="flex" minHeight="calc(100vh - 64px)">
      {isMobile && (
        <Box position="fixed" top="64px" right={16} zIndex={1000}>
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#2A2B33" : "#F1F5F9",
              },
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </Box>
      )}

      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <Box width={280}>{drawerContent}</Box>
        </Drawer>
      ) : (
        <Box
          width={260}
          borderRight={`1px solid ${theme.palette.divider}`}
          bgcolor={theme.palette.background.paper}
        >
          {drawerContent}
        </Box>
      )}

      <Box
        flex={1}
        overflow="auto"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ px: { xs: 2, md: 2.5 }, pt: { xs: 2, md: 2.5 }, pb: 0 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0 }}>
            {tabs.find((t) => t.id === activeTab)?.label}
          </Typography>
        </Box>
        <Box
          flex={1}
          overflow="auto"
          sx={{ px: { xs: 2, md: 2.5 }, py: { xs: 2, md: 2.5 } }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default ModerationDashboard;
