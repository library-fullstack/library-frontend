import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Fab,
  Zoom,
  Snackbar,
  Alert,
} from "@mui/material";
import { TuneOutlined, Home, KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BookCatalogFilters from "../../widgets/book-catalog-filters/BookCatalogFilters";
import BookCatalogGrid from "../../widgets/book-catalog-grid/BookCatalogGrid";
import { booksApi, categoriesApi } from "../../features/books/api";
import type {
  Book,
  Category,
  BookFilters,
  SortOption,
} from "../../features/books/types";

export default function BookList(): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // states
  const [books, setBooks] = useState<Book[]>([]);
  // sách đang hiển thị
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  // tổng số sách trong database
  const [totalBooksInDB, setTotalBooksInDB] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // số lượng sách mỗi lần tải là 12
  // đặt ngoài state để tránh render lại
  const BOOKS_PER_BATCH = 12;

  // filter state
  const [filters, setFilters] = useState<BookFilters>({
    keyword: "",
    category_id: null,
    status: undefined,
    format: null,
    language_code: null,
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest-published");

  // drawer mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // nút scroll đến đầu trang
  const [showScrollTop, setShowScrollTop] = useState(false);

  // loại sách
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // thông báo
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  // fetch tổng số lượng sách từ api
  useEffect(() => {
    const fetchTotalBooks = async () => {
      try {
        const count = await booksApi.getPublicBookCount();
        setTotalBooksInDB(count.total);
      } catch (err) {
        console.error("Error fetching book count:", err);
      }
    };

    fetchTotalBooks();
  }, []);

  // fetch loại sách
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await categoriesApi.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // không báo error. chỉ báo loại sách là trống
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // fetch lại khi filter ( mấy cái sắp xếp ) thay đổi
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setPage(1);
      setDisplayedBooks([]);

      try {
        // lấy sort từ backend
        // khá lag ở phần này. cần phải xử lí
        const params: {
          keyword?: string;
          category_id?: number;
          status?: string;
          limit: number;
          offset: number;
          sort_by?:
            | "newest"
            | "oldest"
            | "newest_added"
            | "oldest_added"
            | "title_asc"
            | "title_desc"
            | "popular";
        } = {
          limit: 500,
          offset: 0,
        };

        if (filters.keyword?.trim()) params.keyword = filters.keyword.trim();
        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.status) params.status = filters.status;

        // sort bằng gì ...
        switch (sortBy) {
          case "newest-published":
            params.sort_by = "newest";
            break;
          case "oldest-published":
            params.sort_by = "oldest";
            break;
          case "newest-added":
            params.sort_by = "newest_added";
            break;
          case "oldest-added":
            params.sort_by = "oldest_added";
            break;
          case "title-asc":
            params.sort_by = "title_asc";
            break;
          case "title-desc":
            params.sort_by = "title_desc";
            break;
          case "popular":
            params.sort_by = "popular";
            break;
        }

        const data = await booksApi.getAllBooks(params);

        let filteredBooks = Array.isArray(data) ? data : [];

        if (filters.format) {
          filteredBooks = filteredBooks.filter(
            (book) => book.format === filters.format
          );
        }

        if (filters.language_code) {
          filteredBooks = filteredBooks.filter(
            (book) => book.language_code === filters.language_code
          );
        }

        const needClientSort = !!(filters.format || filters.language_code);

        if (needClientSort) {
          switch (sortBy) {
            case "newest-published":
              filteredBooks.sort((a, b) => {
                const yearA = a.publication_year || 0;
                const yearB = b.publication_year || 0;
                if (yearB !== yearA) return yearB - yearA;
                return (
                  new Date(b.created_at || 0).getTime() -
                  new Date(a.created_at || 0).getTime()
                );
              });
              break;
            case "oldest-published":
              filteredBooks.sort((a, b) => {
                const yearA = a.publication_year || 9999;
                const yearB = b.publication_year || 9999;
                if (yearA !== yearB) return yearA - yearB;
                return (
                  new Date(a.created_at || 0).getTime() -
                  new Date(b.created_at || 0).getTime()
                );
              });
              break;
            case "newest-added":
              filteredBooks.sort(
                (a, b) =>
                  new Date(b.created_at || 0).getTime() -
                  new Date(a.created_at || 0).getTime()
              );
              break;
            case "oldest-added":
              filteredBooks.sort(
                (a, b) =>
                  new Date(a.created_at || 0).getTime() -
                  new Date(b.created_at || 0).getTime()
              );
              break;
            case "title-asc":
              filteredBooks.sort((a, b) =>
                a.title.localeCompare(b.title, "vi")
              );
              break;
            case "title-desc":
              filteredBooks.sort((a, b) =>
                b.title.localeCompare(a.title, "vi")
              );
              break;
            case "popular":
              filteredBooks.sort(
                (a, b) => (b.copies_count || 0) - (a.copies_count || 0)
              );
              break;
          }
        }

        setBooks(filteredBooks);

        const firstBatch = filteredBooks.slice(0, BOOKS_PER_BATCH);
        setDisplayedBooks(firstBatch);
        setHasMore(filteredBooks.length > BOOKS_PER_BATCH);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
        setDisplayedBooks([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters, sortBy]);

  const handleLoadMore = React.useCallback(() => {
    const nextPage = page + 1;
    const startIndex = page * BOOKS_PER_BATCH;
    const endIndex = startIndex + BOOKS_PER_BATCH;
    const nextBatch = books.slice(startIndex, endIndex);

    if (nextBatch.length > 0) {
      setDisplayedBooks((prev) => [...prev, ...nextBatch]);
      setPage(nextPage);
      setHasMore(endIndex < books.length);
    } else {
      setHasMore(false);
    }
  }, [page, books, BOOKS_PER_BATCH]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFiltersChange = React.useCallback((newFilters: BookFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = React.useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, []);

  const handleAddToCart = React.useCallback(
    (bookId: number) => {
      const book = books.find((b) => b.id === bookId);
      setSnackbar({
        open: true,
        message: `Đã thêm "${book?.title}" vào giỏ sách`,
        severity: "success",
      });
    },
    [books]
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, sm: 5, md: 6 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* breadcum */}
        <Breadcrumbs
          sx={{
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            "& .MuiBreadcrumbs-separator": {
              mx: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <Link
            component="button"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              cursor: "pointer",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ fontSize: { xs: 18, sm: 18 } }} />
            Trang chủ
          </Link>
          <Typography
            sx={{
              color: "text.primary",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Danh mục sách
          </Typography>
        </Breadcrumbs>

        {/* header trang*/}
        <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
              gap: 1.5,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={700}
              sx={{
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                    : "linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                flex: 1,
                minWidth: 0,
              }}
            >
              Thư viện sách
            </Typography>

            {isMobile && (
              <IconButton
                onClick={() => setMobileFiltersOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  flexShrink: 0,
                  mr: 0.8,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <TuneOutlined />
              </IconButton>
            )}
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
            }}
          >
            Khám phá kho tàng tri thức với hàng nghìn đầu sách phong phú
          </Typography>
        </Box>

        {/* nội dung chính */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0, md: 3 },
            alignItems: "flex-start",
          }}
        >
          {/* filter navbar - trên desktop */}
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <BookCatalogFilters
                filters={filters}
                sortBy={sortBy}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                categories={categories}
                categoriesLoading={categoriesLoading}
              />
            </Box>
          )}

          {/* filter drawer - trên mobile */}
          {isMobile && (
            <BookCatalogFilters
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              categories={categories}
              categoriesLoading={categoriesLoading}
              mobileOpen={mobileFiltersOpen}
              onMobileClose={() => setMobileFiltersOpen(false)}
            />
          )}

          {/* book scroll vô hạn */}
          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <BookCatalogGrid
              books={displayedBooks}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onAddToCart={handleAddToCart}
              totalBooks={totalBooksInDB}
            />
          </Box>
        </Box>
      </Container>

      {/* nút scroll từ chỗ bấm lên đầu trang*/}
      <Zoom in={showScrollTop}>
        <Fab
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: { xs: 80, md: 24 },
            right: { xs: 16, md: 24 },
            bgcolor: "primary.main",
            color: "#fff",
            "&:hover": { bgcolor: "primary.dark" },
            boxShadow: 3,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>

      {/* thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
