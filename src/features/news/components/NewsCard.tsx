import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { News, NewsCategory } from "../../../shared/types/news.types";

interface NewsCardProps {
  news: News;
}

const categoryLabels: Record<NewsCategory, string> = {
  ANNOUNCEMENT: "Thông báo",
  GUIDE: "Hướng dẫn",
  UPDATE: "Cập nhật",
  OTHER: "Khác",
};

const categoryColors: Record<
  NewsCategory,
  "primary" | "success" | "info" | "default"
> = {
  ANNOUNCEMENT: "primary",
  GUIDE: "success",
  UPDATE: "info",
  OTHER: "default",
};

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${news.slug}`);
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textDecoration: "none",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={handleClick}
    >
      {news.thumbnail_url && (
        <CardMedia
          component="img"
          height="180"
          image={news.thumbnail_url}
          alt={news.title}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <Chip
            label={categoryLabels[news.category]}
            size="small"
            color={categoryColors[news.category]}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ alignSelf: "center" }}
          >
            {format(new Date(news.published_at), "dd/MM/yyyy", { locale: vi })}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "3.2em",
          }}
        >
          {news.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {getExcerpt(news.content)}
        </Typography>

        {news.author_name && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            Bởi {news.author_name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
