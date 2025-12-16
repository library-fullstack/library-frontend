import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import {
  MessageCircle,
  Heart,
  Eye,
  Pin as PinIcon,
  Lock as LockIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { parseBackendTimestamp } from "../hooks/useForum";
import type { ForumPostDetail } from "../types/forum.types";

interface ForumPostCardProps {
  post: ForumPostDetail;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handlePostClick = () => {
    const categorySlug = post.category_slug || post.category?.slug || "general";
    navigate(`/forum/${categorySlug}/${post.id}`);
  };

  const excerpt = post.content.substring(0, 150).replace(/<[^>]*>/g, "");

  return (
    <Card
      onClick={handlePostClick}
      sx={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 12px 24px ${
            theme.palette.mode === "dark"
              ? "rgba(79, 70, 229, 0.15)"
              : "rgba(79, 70, 229, 0.1)"
          }`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <Avatar
          src={post.userAvatar}
          alt={post.userName}
          sx={{ width: 40, height: 40, flexShrink: 0 }}
        >
          {post.userName?.charAt(0).toUpperCase() || "U"}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: theme.palette.text.primary }}
              >
                {post.userName || "Anonymous"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                {formatDistanceToNow(
                  parseBackendTimestamp(
                    post.createdAt || post.created_at || ""
                  ),
                  {
                    locale: vi,
                    addSuffix: true,
                  }
                )}
              </Typography>
            </Box>
            {post.category && (
              <Chip
                label={post.category.name}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        {post.pinned && (
          <PinIcon
            size={18}
            style={{ transform: "rotate(45deg)", flexShrink: 0 }}
            color={theme.palette.primary.main}
          />
        )}
        {post.is_locked && (
          <LockIcon
            size={16}
            style={{ flexShrink: 0 }}
            color={theme.palette.text.secondary}
          />
        )}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {post.title}
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {excerpt}
          {post.content.length > 150 && "..."}
        </Typography>
      </Box>

      {/* Stats footer */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
          fontSize: "0.875rem",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Eye size={16} />
            <span>{post.views_count || 0}</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MessageCircle size={16} />
            <span>{post.comments_count || 0}</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Heart size={16} />
            <span>{post.likes_count || 0}</span>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

export default ForumPostCard;
