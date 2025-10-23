import * as React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import {
  TrendingUp,
  ChatBubbleOutline,
  FavoriteBorder,
  VisibilityOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ForumPost } from "../../features/forum/types/forum.types";

const MotionCard = motion(Card);

interface ForumPostCardProps {
  post: ForumPost;
  index?: number;
  onClick?: (postId: number) => void;
}

export default function ForumPostCard({
  post,
  index = 0,
  onClick,
}: ForumPostCardProps): React.ReactElement {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      onClick={() => onClick?.(post.id)}
      sx={{
        borderRadius: 2,
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: "divider",
        cursor: onClick ? "pointer" : "default",
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
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
        >
          {/* avatar */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Avatar
              src={post.avatar}
              alt={post.author}
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
              }}
            />
            {/* mobile: hiện author & category ngay bên avatar */}
            <Box sx={{ display: { xs: "block", sm: "none" }, flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {post.author}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {post.timestamp}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* content */}
          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
            {/* header - desktop only */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1, display: { xs: "none", sm: "flex" } }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
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
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {post.timestamp}
                  </Typography>
                </Stack>
              </Box>
              <TrendingUp sx={{ color: "success.main" }} />
            </Stack>

            {/* title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1rem", md: "1.25rem" },
                "&:hover": { color: "primary.main" },
              }}
            >
              {post.title}
            </Typography>

            {/* content preview */}
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
                fontSize: { xs: "0.85rem", md: "0.875rem" },
              }}
            >
              {post.content}
            </Typography>

            {/* tags */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mb: 2,
                flexWrap: "wrap",
                gap: 0.5,
              }}
            >
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: { xs: 22, md: 24 },
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                    borderRadius: 1,
                    borderColor: "divider",
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* thống kê */}
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
              sx={{ flexWrap: "wrap", gap: { xs: 1, sm: 0 } }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <VisibilityOutlined
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    color: "text.secondary",
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  {post.views.toLocaleString()}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ChatBubbleOutline
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    color: "text.secondary",
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  {post.replies}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <FavoriteBorder
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    color: "text.secondary",
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  {post.likes}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </MotionCard>
  );
}
