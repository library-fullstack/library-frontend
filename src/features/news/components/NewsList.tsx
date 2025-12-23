import React from "react";
import { Grid, Box, CircularProgress, Typography, Alert } from "@mui/material";
import { NewsCard } from "./NewsCard";
import type { News } from "../../../shared/types/news.types";

interface NewsListProps {
  news: News[];
  loading?: boolean;
  error?: string | null;
}

export const NewsList: React.FC<NewsListProps> = ({ news, loading, error }) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!news || news.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          Chưa có tin tức nào
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {news.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <NewsCard news={item} />
        </Grid>
      ))}
    </Grid>
  );
};
