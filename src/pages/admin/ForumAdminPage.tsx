import React, { useState, Suspense, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import {
  FileText as PostsIcon,
  AlertCircle as ReportsIcon,
  Clock as LogsIcon,
  FolderOpen as CategoriesIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
} from "lucide-react";
import ModerationPendingPosts from "../../features/forum/components/ModerationPendingPosts";
import ModerationReports from "../../features/forum/components/ModerationReports";
import ModerationActivityLogs from "../../features/forum/components/ModerationActivityLogs";
import ForumCategoriesPanel from "./ForumCategoriesPanel";
import ForumSettingsPanel from "./ForumSettingsPanel";
import ForumUsersPanel from "./ForumUsersPanel";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forum-tabpanel-${index}`}
      aria-labelledby={`forum-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ForumAdminPage() {
  const [searchParams] = useSearchParams();
  const tabParam = parseInt(searchParams.get("tab") || "0", 10);
  const [value, setValue] = useState(tabParam);
  const theme = useTheme();

  useEffect(() => {
    const tabParam = parseInt(searchParams.get("tab") || "0", 10);
    const timer = setTimeout(() => {
      setValue(tabParam);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: "Bài viết chờ duyệt",
      icon: PostsIcon,
      component: ModerationPendingPosts,
    },
    {
      label: "Báo cáo vi phạm",
      icon: ReportsIcon,
      component: ModerationReports,
    },
    {
      label: "Nhật ký hoạt động",
      icon: LogsIcon,
      component: ModerationActivityLogs,
    },
    {
      label: "Quản lý chủ đề",
      icon: CategoriesIcon,
      component: ForumCategoriesPanel,
    },
    {
      label: "Cài đặt diễn đàn",
      icon: SettingsIcon,
      component: ForumSettingsPanel,
    },
    {
      label: "Quản lý người dùng",
      icon: UsersIcon,
      component: ForumUsersPanel,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <Tab
                key={index}
                id={`forum-tab-${index}`}
                aria-controls={`forum-tabpanel-${index}`}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconComponent size={18} />
                    {tab.label}
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            <Suspense
              fallback={
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="400px"
                >
                  <CircularProgress />
                </Box>
              }
            >
              <tab.component />
            </Suspense>
          </TabPanel>
        ))}
      </Paper>
    </Container>
  );
}
