import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Snackbar,
} from "@mui/material";
import {
  Home,
  LocalOffer,
  CheckCircle,
  ErrorOutline,
  Favorite,
  FavoriteBorder,
  Share,
} from "@mui/icons-material";
import { checkBookAvailable } from "../../features/books/api/books.api";
import type { ApiError } from "../../shared/types/api-error";
import BookInfoCard from "./components/BookInfoCard";
import RelatedBooksSection from "./components/RelatedBooksSection";
import SameAuthorBooksSection from "./components/SameAuthorBooksSection";
import RecentBorrowersSection from "./components/RecentBorrowersSection";
import BookImageGallery from "./components/BookImageGallery";
import BookCopiesSection from "./components/BookCopiesSection";
import AddToBorrowButton from "../../features/borrow/components/AddToBorrowButton";
import logger from "@/shared/lib/logger";
import { useBook } from "@/features/books/hooks/useBooks";
import StorageUtil from "../../shared/lib/storage";
import { STORAGE_KEYS } from "../../shared/lib/storageKeys";

export default function BookDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: book,
    isLoading: loading,
    error: queryError,
  } = useBook(id ? Number(id) : 0);

  const [available, setAvailable] = useState<boolean>(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const error = queryError
    ? "Không thể tải thông tin sách. Vui lòng thử lại sau."
    : null;

  useEffect(() => {
    if (!book || !id) return;

    const checkAvailability = async () => {
      const token = StorageUtil.getItem(STORAGE_KEYS.auth.token);
      if (token) {
        setCheckingAvailability(true);
        try {
          const availabilityData = await checkBookAvailable(Number(id));
          setAvailable(availabilityData.available);
        } catch (err) {
          logger.error("Lỗi khi kiểm tra tình trạng sẵn có:", err);
          const isAuthError = (err as ApiError)?.response?.status === 401;
          if (isAuthError && book.available_count && book.available_count > 0) {
            setAvailable(true);
          } else {
            setAvailable(false);
          }
        } finally {
          setCheckingAvailability(false);
        }
      } else {
        setAvailable((book.available_count ?? 0) > 0);
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [book, id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSnackbar({
      open: true,
      message: !isFavorite
        ? "Đã thêm vào danh sách yêu thích"
        : "Đã xóa khỏi danh sách yêu thích",
      severity: "success",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: book?.title || "Sách",
      text: `Xem sách: ${book?.title}`,
      url: window.location.href,
    };

    const manualCopy = () => {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          setSnackbar({
            open: true,
            message: "Đã sao chép link vào clipboard",
            severity: "success",
          });
        } else {
          throw new Error("execCommand copy failed");
        }
      } catch {
        document.body.removeChild(textArea);
        setSnackbar({
          open: true,
          message: `Link: ${window.location.href}`,
          severity: "info",
        });
      }
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        try {
          await navigator.share(shareData);
          setSnackbar({
            open: true,
            message: "Chia sẻ thành công",
            severity: "success",
          });
          return;
        } catch (shareErr) {
          if ((shareErr as Error).name === "AbortError") {
            logger.log("Share cancelled by user");
            return;
          }
          logger.warn("Share failed, falling back to clipboard:", shareErr);
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({
          open: true,
          message: "Đã sao chép link vào clipboard",
          severity: "success",
        });
      } catch (clipboardErr) {
        logger.warn("Clipboard API failed, trying manual copy:", clipboardErr);
        manualCopy();
      }
    } catch (_err) {
      logger.error("All share methods failed:", _err);
      manualCopy();
    }
  };

  const formatAuthors = (authorNames: string | null | undefined): string[] => {
    if (!authorNames || typeof authorNames !== "string")
      return ["Đang cập nhật"];
    return authorNames.split(",").map((name) => name.trim());
  };

  const formatTags = (tags: string[] | null | undefined): string[] => {
    if (!tags || tags.length === 0) return [];
    return tags;
  };

  const getFormatLabel = (format: string | null | undefined): string => {
    if (!format) return "Không xác định";
    switch (format) {
      case "PAPERBACK":
        return "Bìa mềm";
      case "HARDCOVER":
        return "Bìa cứng";
      case "OTHER":
        return "Khác";
      default:
        return format;
    }
  };

  const getStatusColor = (
    status: string | undefined
  ): "success" | "warning" | "default" => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string | undefined): string => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Tạm ngưng";
      case "DRAFT":
        return "Nháp";
      default:
        return "Không xác định";
    }
  };

  const handleAuthorClick = (authorName: string) => {
    navigate(
      `/catalog?search=${encodeURIComponent(authorName)}&searchType=author`
    );
  };

  const handleCategoryClick = () => {
    if (book?.category_id) {
      navigate(`/catalog?category=${book.category_id}`);
    }
  };

  const handlePublisherClick = () => {
    if (book?.publisher_name) {
      navigate(
        `/catalog?search=${encodeURIComponent(
          book.publisher_name
        )}&type=publisher`
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "33.33%" } }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={450}
                sx={{ borderRadius: 2 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={60} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="rectangular" width="100%" height={100} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "Không tìm thấy sách."}
          </Alert>
          <Button variant="contained" onClick={() => navigate("/catalog")}>
            Quay lại danh mục
          </Button>
        </Container>
      </Box>
    );
  }

  const authors = formatAuthors(book.author_names);
  const tags = formatTags(book.tags);
  const hasPublisherLocation = book.publisher_city || book.publisher_country;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Breadcrumbs
          sx={{
            mb: { xs: 1.5, sm: 2, md: 3 },
            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
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
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ fontSize: 18 }} />
            Trang chủ
          </Link>
          <Link
            component="button"
            onClick={() => navigate("/catalog")}
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
          >
            Danh mục sách
          </Link>
          <Typography
            sx={{
              color: "text.primary",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            {book.title}
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 3, lg: 4 },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              minWidth: { md: 0 },
              flexBasis: { md: "35%" },
              flexShrink: 0,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                position: { md: "sticky" },
                top: 100,
              }}
            >
              <BookImageGallery
                images={book.images || []}
                title={book.title}
                mainImage={book.thumbnail_url || undefined}
              />

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    TRẠNG THÁI
                  </Typography>
                  <Chip
                    label={getStatusLabel(book.status)}
                    color={getStatusColor(book.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    KHẢ DỤNG
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {checkingAvailability ? (
                      <Skeleton width={100} height={24} />
                    ) : available ? (
                      <>
                        <CheckCircle color="success" sx={{ fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight={600}
                        >
                          Còn sách
                        </Typography>
                      </>
                    ) : (
                      <>
                        <ErrorOutline color="error" sx={{ fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          color="error.main"
                          fontWeight={600}
                        >
                          Hết sách
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {book.available_count !== undefined &&
                  book.copies_count !== undefined && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        Còn {book.available_count || 0}/{book.copies_count || 0}{" "}
                        bản
                      </Typography>
                    </Box>
                  )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!available || book.status !== "ACTIVE"}
                  onClick={() => {}}
                  sx={{
                    display: "none",
                  }}
                >
                  {available ? "Mượn sách" : "Không khả dụng"}
                </Button>

                <AddToBorrowButton
                  bookId={book.id}
                  bookTitle={book.title}
                  available_count={book.available_count}
                  variant="contained"
                  size="large"
                  fullWidth
                  quantity={1}
                  onNotify={(message, severity) =>
                    setSnackbar({ open: true, message, severity })
                  }
                />

                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 1,
                      textTransform: "none",
                      color: isFavorite ? "error.main" : "text.secondary",
                      borderColor: isFavorite ? "error.main" : "divider",
                      "&:hover": {
                        borderColor: isFavorite ? "error.dark" : "primary.main",
                        bgcolor: isFavorite
                          ? "rgba(239, 68, 68, 0.04)"
                          : "rgba(79, 70, 229, 0.04)",
                      },
                    }}
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? "Đã thích" : "Yêu thích"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleShare}
                    sx={{
                      minWidth: 56,
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      borderColor: "divider",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(79, 70, 229, 0.04)",
                      },
                    }}
                  >
                    <Share />
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                fontWeight={700}
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  lineHeight: 1.3,
                  color: "text.primary",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                {book.title}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {authors && authors.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: "0.95rem" }}
                    >
                      Tác giả:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {authors.map((authorName, index) => (
                        <Typography
                          key={index}
                          variant="body1"
                          fontWeight={600}
                          onClick={() => handleAuthorClick(authorName)}
                          sx={{
                            color: "primary.main",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              textDecorationColor: "primary.main",
                            },
                          }}
                        >
                          {authorName}
                          {index < authors.length - 1 && ","}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: "0.95rem" }}
                    >
                      Tác giả:
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        color: "primary.main",
                        fontSize: "0.95rem",
                      }}
                    >
                      Đang cập nhật
                    </Typography>
                  </Box>
                )}
              </Box>

              {tags.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      icon={<LocalOffer sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor:
                          theme.palette.mode === "light"
                            ? "rgba(79, 70, 229, 0.08)"
                            : "rgba(129, 140, 248, 0.12)",
                        color: "primary.main",
                        fontWeight: 500,
                        borderRadius: 1.5,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2,
                mb: 4,
              }}
            >
              {book.category_name && (
                <BookInfoCard
                  label="THỂ LOẠI"
                  value={book.category_name}
                  onClick={handleCategoryClick}
                />
              )}

              {book.publisher_name && (
                <BookInfoCard
                  label="NHÀ XUẤT BẢN"
                  value={
                    hasPublisherLocation
                      ? `${book.publisher_name} ${
                          book.publisher_city ? `(${book.publisher_city}` : ""
                        }${
                          book.publisher_country
                            ? `, ${book.publisher_country})`
                            : book.publisher_city
                            ? ")"
                            : ""
                        }`
                      : book.publisher_name
                  }
                  onClick={handlePublisherClick}
                />
              )}

              {book.publisher_city && (
                <BookInfoCard label="THÀNH PHỐ" value={book.publisher_city} />
              )}

              {book.publisher_country && (
                <BookInfoCard label="QUỐC GIA" value={book.publisher_country} />
              )}

              {book.publication_year && (
                <BookInfoCard
                  label="NĂM XUẤT BẢN"
                  value={String(book.publication_year)}
                />
              )}

              {book.language_code && (
                <BookInfoCard
                  label="NGÔN NGỮ"
                  value={book.language_code.toUpperCase()}
                />
              )}

              {book.format && (
                <BookInfoCard
                  label="ĐỊNH DẠNG"
                  value={getFormatLabel(book.format)}
                />
              )}

              {book.isbn13 && (
                <BookInfoCard label="ISBN-13" value={book.isbn13} />
              )}

              {book.call_number && (
                <BookInfoCard label="MÃ SỐ GỌI" value={book.call_number} />
              )}
            </Box>

            {book.description && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Mô tả
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "text.primary",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {book.description}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {book.copies && book.copies.length > 0 && (
          <BookCopiesSection copies={book.copies} />
        )}

        <RecentBorrowersSection bookTitle={book.title} />

        <RelatedBooksSection
          currentBookId={book.id}
          categoryId={book.category_id}
          categoryName={book.category_name}
        />

        <SameAuthorBooksSection
          currentBookId={book.id}
          authorNames={book.author_names}
        />
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{ top: { xs: "60px", sm: "140px" }, zIndex: 9999 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
