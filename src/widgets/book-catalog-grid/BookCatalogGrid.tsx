import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { MenuBook } from "@mui/icons-material";
import BookCard from "../book-card/BookCard";
import type { Book } from "../../features/books/types";
import logger from "@/shared/lib/logger";

interface BookCatalogGridProps {
  books: Book[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onAddToCart?: (bookId: number) => void;
  totalBooks?: number;
  addingBookId?: number | null;
}

export default function BookCatalogGrid({
  books,
  loading = false,
  hasMore = false,
  onLoadMore,
  onAddToCart,
  totalBooks,
  addingBookId = null,
}: BookCatalogGridProps): React.ReactElement {
  const theme = useTheme();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // giúp scroll vô hạn ( cho đến khi hết sách )
  useEffect(() => {
    if (!hasMore || loading || !onLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          logger.log("Load more triggered");
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, onLoadMore]);
  if (loading && books.length === 0) {
    return (
      <Box sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
        {/* phần header skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Skeleton width={200} height={32} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: { xs: 1, sm: 1.5, md: 2 },
            alignItems: "stretch",
            gridAutoRows: "1fr",
            justifyItems: "stretch",
          }}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index}>
              <Skeleton
                variant="rectangular"
                sx={{ aspectRatio: "2/3" }}
                animation="wave"
              />
              <CardContent>
                <Skeleton height={28} width="90%" />
                <Skeleton height={20} width="70%" />
                <Skeleton height={20} width="50%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  // state trống
  if (!loading && books.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor:
              theme.palette.mode === "light"
                ? "rgba(79, 70, 229, 0.08)"
                : "rgba(129, 140, 248, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <MenuBook
            sx={{
              fontSize: 60,
              color: "primary.main",
              opacity: 0.6,
            }}
          />
        </Box>
        <Typography
          variant="h5"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          Không tìm thấy sách
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* phần header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, sm: 2.5, md: 3 },
          pb: { xs: 1.5, sm: 2 },
          borderBottom: 1,
          borderColor: "divider",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
            flex: 1,
            minWidth: 0,
          }}
        >
          Danh mục sách
        </Typography>
        {totalBooks !== undefined && totalBooks > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {totalBooks} cuốn sách
          </Typography>
        )}
      </Box>
      {/* books grid với stagger animation */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1, sm: 1, md: 1 },
          width: "100%",
        }}
      >
        {books.map((book) => (
          <Box
            key={book.id}
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <BookCard
              book={book}
              onAddToCart={onAddToCart}
              isAddingToCart={addingBookId === book.id}
            />
          </Box>
        ))}
      </Box>
      {/* điểm kích hoạt tải thêm dữ liệu khi đến cuối trang */}
      {hasMore && (
        <Box
          ref={loadMoreRef}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 6,
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress
              size={56}
              thickness={3.5}
              sx={{
                color: "primary.main",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Đang tải thêm sách...
            </Typography>
          </Box>
        </Box>
      )}
      {/* khi scroll đến hết sách thì báo  */}
      {!hasMore && books.length > 0 && (
        <Box sx={{ textAlign: "center", py: 6, mt: 4 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontStyle: "italic",
              fontSize: "0.875rem",
            }}
          >
            Bạn đã xem hết {books.length} cuốn sách
          </Typography>
        </Box>
      )}
    </Box>
  );
}
