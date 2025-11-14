import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import BookCatalogFilters from "../../widgets/book-catalog-filters/BookCatalogFilters";
import BookCatalogGrid from "../../widgets/book-catalog-grid/BookCatalogGrid";
import SeoMetaTags from "../../shared/components/SeoMetaTags";
import { useAddToCart, useCart } from "../../features/borrow/hooks/useCart";
import type { BookFilters, SortOption } from "../../features/books/types";
import logger from "@/shared/lib/logger";
import {
  useBooksInfinite,
  useBookCount,
} from "@/features/books/hooks/useBooks";
import { useCategories } from "@/features/books/hooks/useCategories";
import { useCurrentUser } from "@/features/users/hooks/useUser";

export default function BookList(): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams] = useSearchParams();

  // State management
  const [filters, setFilters] = useState<BookFilters>({
    keyword: "",
    category_id: null,
    status: undefined,
    format: null,
    language_code: null,
    searchType: undefined,
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest-published");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  // Data fetching
  const { data: categoriesData = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: bookCount } = useBookCount();
  const totalBooksInDB = bookCount?.total || 0;

  // Sort mapping
  const sortByMap: Record<
    SortOption,
    | "newest"
    | "oldest"
    | "newest_added"
    | "oldest_added"
    | "title_asc"
    | "title_desc"
    | "popular"
  > = {
    "newest-published": "newest",
    "oldest-published": "oldest",
    "newest-added": "newest_added",
    "oldest-added": "oldest_added",
    "title-asc": "title_asc",
    "title-desc": "title_desc",
    popular: "popular",
  };

  // Fetch books with infinite scroll
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useBooksInfinite({
      keyword: filters.keyword?.trim() || undefined,
      categoryId: filters.category_id || undefined,
      status: filters.status || undefined,
      searchType: filters.searchType || undefined,
      sort_by: sortByMap[sortBy],
      limit: 12,
    });

  const allBooks = React.useMemo(() => {
    if (!data?.pages) return [];
    const seen = new Set<number>();
    const result: (typeof data.pages)[0] = [];

    data.pages.forEach((page) => {
      if (Array.isArray(page)) {
        page.forEach((book) => {
          if (!seen.has(book.id)) {
            seen.add(book.id);
            result.push(book);
          }
        });
      }
    });

    return result;
  }, [data]);

  // Update filters from URL search params (memoized to avoid issues)
  React.useLayoutEffect(() => {
    const searchQuery = searchParams.get("search");
    const categoryQuery = searchParams.get("category");
    const searchTypeQuery =
      searchParams.get("searchType") || searchParams.get("type");

    setFilters({
      keyword: searchQuery || "",
      category_id: categoryQuery ? Number(categoryQuery) : null,
      status: undefined,
      format: null,
      language_code: null,
      searchType:
        (searchTypeQuery as
          | "author"
          | "title"
          | "publisher"
          | "all"
          | undefined) || undefined,
    });
  }, [searchParams]);

  // Scroll to top when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers
  const handleFiltersChange = (newFilters: BookFilters) => {
    const params = new URLSearchParams();
    if (newFilters.keyword?.trim())
      params.set("search", newFilters.keyword.trim());
    if (newFilters.category_id)
      params.set("category", String(newFilters.category_id));
    navigate(`/catalog${params.toString() ? "?" + params.toString() : ""}`, {
      replace: true,
    });
  };

  const { data: user } = useCurrentUser();
  const { data: cart } = useCart(!!user);
  const { mutateAsync: addItem } = useAddToCart();
  const [addingBookId, setAddingBookId] = useState<number | null>(null);

  const handleAddToCart = useCallback(
    async (bookId: number) => {
      const book = allBooks.find((b) => b.id === bookId);
      if (!book) {
        logger.warn(`[BookList.handleAddToCart] Book ${bookId} not found`);
        return;
      }

      // PREVENT DOUBLE CLICKS: if already adding this book, block
      if (addingBookId === bookId) {
        logger.debug(
          `[BookList.handleAddToCart] Already adding book ${bookId}, blocking duplicate click`
        );
        return;
      }

      // Get cart item if exists (has fresher available_count)
      const existingItem = cart?.items.find((item) => item.bookId === bookId);

      // Use fresh available_count from cart if exists, otherwise from book
      const availableCount =
        existingItem?.available_count ??
        (typeof book.available_count === "string"
          ? parseInt(book.available_count, 10)
          : book.available_count || 0);

      const currentQuantityInCart = existingItem?.quantity || 0;
      const totalAfterAdd = currentQuantityInCart + 1;

      // CLIENT-SIDE PRE-VALIDATION (Fast fail without API call)
      if (availableCount <= 0) {
        const maxTitleLength = 30;
        const displayTitle =
          book.title.length > maxTitleLength
            ? book.title.substring(0, maxTitleLength) + "..."
            : book.title;

        setSnackbar({
          open: true,
          message: `"${displayTitle}" đã hết`,
          severity: "warning",
        });
        return; // Stop here - no API call
      }

      // CLIENT-SIDE: Check if already at max (like AddToBorrowButton)
      if (totalAfterAdd > availableCount) {
        const maxTitleLength = 30;
        const displayTitle =
          book.title.length > maxTitleLength
            ? book.title.substring(0, maxTitleLength) + "..."
            : book.title;

        setSnackbar({
          open: true,
          message: `Bạn đã thêm hết "${displayTitle}" vào giỏ! (${currentQuantityInCart}/${availableCount} quyển)`,
          severity: "warning",
        });
        return;
      }

      setAddingBookId(bookId);
      const startTime = performance.now();

      logger.debug(
        `[BookList.handleAddToCart] Adding book ${bookId} - ${book.title}, available: ${availableCount}`
      );

      try {
        await addItem({
          bookId,
          quantity: 1,
          bookAvailableCount: availableCount,
          bookData: {
            title: book.title,
            author_names: book.author_names || null,
            thumbnail_url: book.thumbnail_url || "",
            bookAvailableCount: availableCount,
          },
        });

        // Success - show confirmation with truncated title
        const maxTitleLength = 35;
        const displayTitle =
          book.title.length > maxTitleLength
            ? book.title.substring(0, maxTitleLength) + "..."
            : book.title;

        const endTime = performance.now();
        const duration = endTime - startTime;

        logger.info(
          `[BookList.handleAddToCart] Successfully added book ${bookId} in ${duration.toFixed(
            0
          )}ms`
        );

        setAddingBookId(null);
        setSnackbar({
          open: true,
          message: `Đã thêm "${displayTitle}" vào giỏ`,
          severity: "success",
        });
      } catch (error: unknown) {
        logger.error("[BookList.handleAddToCart] Error:", error);

        const validationError = error as {
          success?: boolean;
          error?: {
            code?: string;
            message?: string;
            currentInCart?: number;
            available?: number;
          };
        };

        if (validationError?.success === false && validationError?.error) {
          const err = validationError.error;
          const maxTitleLength = 30;
          const displayTitle =
            book.title.length > maxTitleLength
              ? book.title.substring(0, maxTitleLength) + "..."
              : book.title;

          let message = "";
          if (
            err.code === "ALREADY_AT_MAX" ||
            err.code === "INSUFFICIENT_STOCK"
          ) {
            message = `Bạn đã thêm hết "${displayTitle}" vào giỏ! (${err.currentInCart}/${err.available} quyển)`;
          } else if (err.code === "OUT_OF_STOCK") {
            message = `"${displayTitle}" đã hết`;
          } else {
            message = err.message || "Không thể thêm vào giỏ";
          }

          // BATCH setState
          setAddingBookId(null);
          setSnackbar({
            open: true,
            message,
            severity: "warning",
          });
        } else {
          // Backend or network error - show error toast
          const err = error as { response?: { data?: { message?: string } } };
          const errorMessage =
            err?.response?.data?.message ||
            "Không thể thêm sách vào giỏ. Vui lòng thử lại.";

          // BATCH setState
          setAddingBookId(null);
          setSnackbar({
            open: true,
            message: errorMessage,
            severity: "error",
          });
        }
      }
    },
    [allBooks, addItem, addingBookId, cart?.items]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((err) =>
        logger.error("Error fetching next page:", err)
      );
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, sm: 5, md: 6 },
      }}
    >
      <SeoMetaTags
        title="Danh sách sách - Thư viện trực tuyến HBH"
        description="Duyệt và tìm kiếm hàng nghìn cuốn sách trong thư viện."
        keywords="danh sách sách, tìm sách, lọc sách, thư viện"
      />

      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          sx={{
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
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
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ fontSize: 18 }} />
            Trang chủ
          </Link>
          <Typography sx={{ color: "text.primary", fontWeight: 600 }}>
            Danh mục sách
          </Typography>
        </Breadcrumbs>

        {/* Title Section */}
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
                flex: 1,
              }}
            >
              {filters.category_id
                ? `Thể loại: "${
                    categoriesData.find((c) => c.id === filters.category_id)
                      ?.name || "?"
                  }"`
                : filters.keyword
                ? `Tìm kiếm: "${filters.keyword}"`
                : "Thư viện sách"}
            </Typography>
            {isMobile && (
              <IconButton
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Mở bộ lọc tìm kiếm"
                sx={{ bgcolor: "primary.main", color: "#fff" }}
              >
                <TuneOutlined />
              </IconButton>
            )}
          </Box>
          <Typography color="text.secondary">
            {allBooks.length > 0
              ? `Hiển thị ${allBooks.length} kết quả`
              : "Khám phá kho tàng tri thức..."}
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0, md: 3 },
            alignItems: "flex-start",
          }}
        >
          {/* Desktop Filters */}
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <BookCatalogFilters
                filters={filters}
                sortBy={sortBy}
                onFiltersChange={handleFiltersChange}
                onSortChange={setSortBy}
                categories={categoriesData}
                categoriesLoading={categoriesLoading}
              />
            </Box>
          )}

          {/* Mobile Filters */}
          {isMobile && (
            <BookCatalogFilters
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
              onSortChange={setSortBy}
              categories={categoriesData}
              categoriesLoading={categoriesLoading}
              mobileOpen={mobileFiltersOpen}
              onMobileClose={() => setMobileFiltersOpen(false)}
            />
          )}

          {/* Books Grid */}
          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <BookCatalogGrid
              books={allBooks}
              loading={isLoading && allBooks.length === 0}
              hasMore={hasNextPage}
              onLoadMore={handleLoadMore}
              onAddToCart={handleAddToCart}
              totalBooks={totalBooksInDB}
              addingBookId={addingBookId}
            />
          </Box>
        </Box>
      </Container>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Cuộn lên đầu trang"
          sx={{
            position: "fixed",
            bottom: { xs: 80, md: 24 },
            right: { xs: 16, md: 24 },
            bgcolor: "primary.main",
            color: "#fff",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "right",
        }}
        TransitionProps={{
          timeout: 200, // Faster transition (default 300ms)
        }}
        sx={{
          top: { xs: "60px", sm: "140px" },
          zIndex: 9999,
          // Optimize rendering
          willChange: "transform, opacity",
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            fontWeight: 600,
            // Optimize rendering
            willChange: "opacity",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
