import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Forum as ForumIcon,
  Search,
  Add,
  TrendingUp,
  ChatBubbleOutline,
  FavoriteBorder,
  VisibilityOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface ForumPost {
  id: number;
  title: string;
  author: string;
  avatar: string;
  category: string;
  content: string;
  views: number;
  replies: number;
  likes: number;
  timestamp: string;
  tags: string[];
}

// giả lập post
const mockPosts: ForumPost[] = [
  {
    id: 1,
    title: "Những cuốn sách hay nên đọc về lập trình",
    author: "Phạm Ngọc Bảo",
    avatar:
      "https://gdtd.1cdn.vn/thumbs/540x360/2023/01/30/cdn.24h.com.vn-upload-1-2023-images-2023-01-30-_1675045134-506-thumbnail-width740height555-auto-crop.jpg",
    category: "Công nghệ",
    content:
      "Xin chào mọi người, mình muốn các bro cho nhận xét về cuốn sách của tác giả Lê Văn Huy...",
    views: 3636,
    replies: 36,
    likes: 36,
    timestamp: "2 giờ trước",
    tags: ["Lập trình", "Sách hay"],
  },
  {
    id: 2,
    title: "Review sách 'Lịch sử loài chó: Lê Văn Huy'",
    author: "Tạ Hữu Anh Bình",
    avatar:
      "https://cdn.tgdd.vn/2022/09/CookDish/rau-ma-co-may-loai-4-mon-ngon-lam-tu-rau-ma-avt-1200x676.jpg",
    category: "Lịch sử",
    content:
      "Vừa đọc xong cuốn này và thực sự rất ấn tượng. Tác giả Nguyễn Thị Quỳnh viết bẩn không tả được...",
    views: 360,
    replies: 67,
    likes: 134,
    timestamp: "5 giờ trước",
    tags: ["Lịch sử", "Nhân loại", "Khoa học"],
  },
  {
    id: 3,
    title: "Trao đổi sách cũ khu vực Hà Nội",
    author: "Lê Văn Huy",
    avatar:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg",
    category: "Trao đổi",
    content:
      "Mình có một số sách cũ còn mới muốn trao đổi với các bạn cùng sở thích đọc sách...",
    views: 567,
    replies: 23,
    likes: 45,
    timestamp: "1 ngày trước",
    tags: ["Trao đổi", "Hà Nội"],
  },
];

// danh mục - maybe cần thêm
const categories = [
  "Tất cả",
  "Công nghệ",
  "Văn học",
  "Lịch sử",
  "Khoa học",
  "Nghệ thuật",
  "Trao đổi",
];

export default function Forum(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");

  // tạm thời như thế này, chưa nghĩ được là cái forum cần cái gì nữa
  // để tạm cho nó đủ
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="lg">
        {/* header */}
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
                      theme.palette.mode === "light" ? "#4F46E5" : "#818CF8",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Diễn đànnnnnnnnnn
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Nơi giao lưu, trao đổi, chia sẻ thông tin về sách...
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Tạo bài viết
            </Button>
          </Stack>

          {/* thanh tìm kiếm forum */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm chủ đề, bài viết..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper",
              },
            }}
          />
        </MotionBox>

        {/* danh mục */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          sx={{ mb: 4 }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ flexWrap: "wrap", gap: 1 }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 1,
                  fontWeight: 600,
                  bgcolor:
                    selectedCategory === category
                      ? "primary.main"
                      : "background.paper",
                  color:
                    selectedCategory === category
                      ? "primary.contrastText"
                      : "text.primary",
                  "&:hover": {
                    bgcolor:
                      selectedCategory === category
                        ? "primary.dark"
                        : "action.hover",
                  },
                }}
              />
            ))}
          </Stack>
        </MotionBox>

        {/* danh sách các bài post, giả lập post, chưa có lấy từ cơ sở dữ liệu */}
        <Stack spacing={3}>
          {mockPosts.map((post, index) => (
            <MotionCard
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              sx={{
                borderRadius: 1,
                transition: "all 0.3s ease",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  boxShadow: (theme) =>
                    theme.palette.mode === "light"
                      ? "0 8px 24px rgba(79,70,229,0.12)"
                      : "0 8px 24px rgba(129,140,248,0.12)",
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2}>
                  {/* avatar */}
                  <Avatar
                    src={post.avatar}
                    alt={post.author}
                    sx={{ width: 48, height: 48 }}
                  />

                  {/* content */}
                  <Box sx={{ flex: 1 }}>
                    {/* header */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {post.author}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={post.category}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {post.timestamp}
                          </Typography>
                        </Stack>
                      </Box>
                      <TrendingUp sx={{ color: "success.main" }} />
                    </Stack>

                    {/* title - giả định */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* review content - để tĩnh, giả định */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {post.content}
                    </Typography>

                    {/* tags */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={`#${tag}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* thông số */}
                    <Stack direction="row" spacing={3}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <VisibilityOutlined
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {post.views.toLocaleString()}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutline
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {post.replies}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FavoriteBorder
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {post.likes}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </MotionCard>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
