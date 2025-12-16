import * as React from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { ForumCategory } from "../../features/forum/types/forum.types";

const MotionBox = motion.create(Box);

interface ForumCategoryTabsProps {
  categories: ForumCategory[];
  selectedCategory: ForumCategory;
  onCategoryChange: (category: ForumCategory) => void;
}

export default function ForumCategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: ForumCategoryTabsProps): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      sx={{ mb: 4 }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
            borderRadius: 3,
          },
        }}
      >
        <Tabs
          value={selectedCategory.id}
          onChange={(e, newValue) => {
            const category = categories.find((c) => c.id === newValue);
            if (category) onCategoryChange(category);
          }}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minHeight: 48,
              px: { xs: 2, sm: 3 },
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          {categories.map((category) => (
            <Tab key={category.id} label={category.name} value={category.id} />
          ))}
        </Tabs>
      </Box>
    </MotionBox>
  );
}
