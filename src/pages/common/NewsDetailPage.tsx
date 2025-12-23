import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import { ArrowBack, CalendarToday, Person } from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNewsBySlug } from "../../features/news/hooks/useNewsQuery";
import { NewsCategory } from "../../shared/types/news.types";

const categoryLabels: Record<NewsCategory, string> = {
  ANNOUNCEMENT: "Thông báo",
  GUIDE: "Hướng dẫn",
  UPDATE: "Cập nhật",
  OTHER: "Khác",
};

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: news, isLoading, error } = useNewsBySlug(slug || "");

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !news) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy tin tức</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/news")}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/news")}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={categoryLabels[news.category]}
            color="primary"
            size="small"
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          {news.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 3,
            flexWrap: "wrap",
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              {format(new Date(news.published_at), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </Typography>
          </Box>
          {news.author_name && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Person sx={{ fontSize: 18 }} />
              <Typography variant="body2">{news.author_name}</Typography>
            </Box>
          )}
        </Box>

        {news.thumbnail_url && (
          <Box
            component="img"
            src={news.thumbnail_url}
            alt={news.title}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 1,
              mb: 3,
            }}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            "& img": {
              maxWidth: "100%",
              height: "auto",
            },
            "& p": {
              marginBottom: 2,
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: 3,
              marginBottom: 2,
              fontWeight: 600,
            },
            "& ul, & ol": {
              paddingLeft: 3,
              marginBottom: 2,
            },
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </Paper>
    </Container>
  );
}
