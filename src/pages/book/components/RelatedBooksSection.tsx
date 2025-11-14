import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BookCard from "../../../widgets/book-card/BookCard";
import { booksApi } from "../../../features/books/api";
import type { Book } from "../../../features/books/types";
import logger from "@/shared/lib/logger";

interface RelatedBooksSectionProps {
  currentBookId: number;
  categoryId?: number | null;
  categoryName?: string | null;
}

export default function RelatedBooksSection({
  currentBookId,
  categoryId,
  categoryName: _categoryName, // Không dùng nhưng giữ lại interface
}: RelatedBooksSectionProps): React.ReactElement | null {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const booksPerRow = isMobile ? 2 : 6;
  const displayCount = booksPerRow * 2;

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const books = await booksApi.getBooksByCategory(categoryId, 100, 0);
        const filtered = books.filter((book) => book.id !== currentBookId);
        setRelatedBooks(filtered);
      } catch (err) {
        logger.error("Lỗi khi lấy sách liên quan:", err);
        setRelatedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBooks();
  }, [currentBookId, categoryId]);

  if (loading) {
    return (
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Sách liên quan
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(6, 1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: displayCount }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (relatedBooks.length === 0) {
    return null;
  }

  const displayedBooks = relatedBooks.slice(0, displayCount);

  const handleViewAll = () => {
    if (categoryId) {
      navigate(`/catalog?category=${categoryId}`);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Sách liên quan
        </Typography>
        {relatedBooks.length > displayCount && (
          <Button
            endIcon={<ArrowForward />}
            onClick={handleViewAll}
            sx={{ textTransform: "none" }}
          >
            Xem thêm
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(6, 1fr)",
          },
          gap: 2,
        }}
      >
        {displayedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </Box>
    </Box>
  );
}
