import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Newspaper, Calendar } from "lucide-react";
import AdminNewsPage from "./AdminNewsPage";
import AdminEventsPage from "./AdminEventsPage";

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
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function AdminContentManagementPage() {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: "Sự kiện",
      icon: Calendar,
    },
    {
      label: "Tin tức",
      icon: Newspaper,
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Tin tức & Sự kiện
      </Typography>

      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mt: 2,
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
                ? "rgba(30, 30, 30, 0.4)"
                : "rgba(255, 255, 255, 0.9)",
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={React.createElement(tab.icon, { size: 18 })}
              iconPosition="start"
              label={tab.label}
              id={`content-tab-${index}`}
              aria-controls={`content-tabpanel-${index}`}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: 56,
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={value} index={0}>
            <AdminEventsPage />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <AdminNewsPage />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}
