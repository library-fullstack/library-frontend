import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Forum as ForumIcon, Search, Add } from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

interface ForumHeaderProps {
  onCreatePost?: () => void;
  onSearch?: (query: string) => void;
}

export default function ForumHeader({
  onCreatePost,
  onSearch,
}: ForumHeaderProps): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ mb: 6 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ForumIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)"
                    : "linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Diễn đàn
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Nơi giao lưu, trao đổi, chia sẻ thông tin về sách...
          </Typography>
        </Box>
        {/* nút tạo bài desktop - desktop only */}
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreatePost}
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Tạo bài viết
          </Button>
        )}
      </Stack>

      {/* thanh tìm kiếm forum */}
      <TextField
        fullWidth
        placeholder="Tìm kiếm chủ đề, bài viết..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "background.paper",
          },
        }}
      />

      {/* nút tạo bài mobile - dưới search bar */}
      {isMobile && (
        <Button
          variant="contained"
          startIcon={<Add />}
          fullWidth
          onClick={onCreatePost}
          sx={{
            mt: 2,
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Tạo bài viết mới
        </Button>
      )}
    </MotionBox>
  );
}
