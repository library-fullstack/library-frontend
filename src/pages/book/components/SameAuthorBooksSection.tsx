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

interface SameAuthorBooksSectionProps {
  currentBookId: number;
  authorNames?: string | null;
}

export default function SameAuthorBooksSection({
  currentBookId,
  authorNames,
}: SameAuthorBooksSectionProps): React.ReactElement | null {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sameAuthorBooks, setSameAuthorBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const booksPerRow = isMobile ? 2 : 6;
  const displayCount = booksPerRow * 2;

  useEffect(() => {
    const fetchSameAuthorBooks = async () => {
      if (!authorNames) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allAuthors = authorNames
          .split(",")
          .map((name) => name.trim())
          .join(" OR ");
        const books = await booksApi.getBooksByKeyword(allAuthors, 20, 0);
        const filtered = books.filter((book) => book.id !== currentBookId);
        setSameAuthorBooks(filtered);
      } catch (err) {
        console.error("Error fetching same author books:", err);
        setSameAuthorBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSameAuthorBooks();
  }, [currentBookId, authorNames]);

  if (loading) {
    return (
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Sách cùng tác giả
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

  if (sameAuthorBooks.length === 0) {
    return null;
  }

  const displayedBooks = sameAuthorBooks.slice(0, displayCount);

  const handleViewAll = () => {
    if (authorNames) {
      const allAuthors = authorNames
        .split(",")
        .map((name) => name.trim())
        .join(" OR ");
      navigate(`/catalog?search=${encodeURIComponent(allAuthors)}`);
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
          Sách cùng tác giả
        </Typography>
        {sameAuthorBooks.length > displayCount && (
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
