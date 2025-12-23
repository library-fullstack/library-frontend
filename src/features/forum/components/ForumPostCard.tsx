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
        transition: "all 0.2s ease",
        border: post.status === "PENDING" ? 2 : 0,
        borderColor: post.status === "PENDING" ? "warning.main" : "transparent",
        bgcolor:
          post.status === "PENDING"
            ? theme.palette.mode === "dark"
              ? "rgba(255, 167, 38, 0.08)"
              : "rgba(255, 167, 38, 0.05)"
            : "background.paper",
        "&:hover": {
          boxShadow: `0 4px 12px ${
            theme.palette.mode === "dark"
              ? "rgba(79, 70, 229, 0.2)"
              : "rgba(79, 70, 229, 0.12)"
          }`,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <Avatar
            src={post.userAvatar}
            alt={post.userName}
            sx={{
              width: { xs: 42, sm: 46 },
              height: { xs: 42, sm: 46 },
              flexShrink: 0,
            }}
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
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    color: theme.palette.text.primary,
                  }}
                >
                  {post.userName || "Anonymous"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  }}
                >
                  {formatDistanceToNow(
                    parseBackendTimestamp(
                      post.createdAt || post.created_at || ""
                    ),
                    { locale: vi, addSuffix: true }
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
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          {post.status === "PENDING" && (
            <Chip
              label="Chờ duyệt"
              size="small"
              color="warning"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          )}
          {post.pinned && (
            <PinIcon
              size={18}
              style={{
                transform: "rotate(45deg)",
                flexShrink: 0,
              }}
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
              fontSize: { xs: "1.05rem", sm: "1.15rem" },
              color: theme.palette.text.primary,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {post.title}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "0.9rem", sm: "0.95rem" },
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {excerpt}
          {post.content.length > 150 && "..."}
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Eye size={18} />
            <span>{post.views_count || 0}</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <MessageCircle size={18} />
            <span>{post.comments_count || 0}</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Heart size={18} />
            <span>{post.likes_count || 0}</span>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

export default ForumPostCard;
