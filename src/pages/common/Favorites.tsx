import React, { useState, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Skeleton,
  Snackbar,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ShoppingCartOutlined, MenuBook } from "@mui/icons-material";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FavouritesContext from "../../context/FavouritesContext";
import { useAddToCart } from "../../features/borrow/components/hooks/useCart";
import { borrowApi } from "../../features/borrow/api/borrow.api";
import logger from "../../shared/lib/logger";

export default function Favorites(): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const favouritesContext = useContext(FavouritesContext);
  const { mutateAsync: addToCart } = useAddToCart();

  const { favourites, loading, removeFavourite } = favouritesContext || {};
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [clearingAll, setClearingAll] = useState(false);

  const handleRemove = async (
    e: React.MouseEvent,
    bookId: number,
    bookTitle: string
  ) => {
    e.stopPropagation();
    if (!removeFavourite) return;

    setRemovingIds((prev) => new Set(prev).add(bookId));
    try {
      await removeFavourite(bookId);
      const displayTitle =
        bookTitle.length > 40 ? bookTitle.slice(0, 40) + "..." : bookTitle;
      setSnackbar({
        open: true,
        message: `Đã xóa "${displayTitle}" khỏi danh sách yêu thích`,
        severity: "success",
      });
    } catch (error) {
      logger.error("Error removing favourite:", error);
      setSnackbar({
        open: true,
        message: "Không thể xóa sách. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  const handleClearAll = async () => {
    if (!favourites || favourites.length === 0 || !removeFavourite) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tất cả ${
        favourites?.length || 0
      } cuốn sách khỏi danh sách yêu thích?`
    );

    if (!confirmed) return;

    setClearingAll(true);
    try {
      for (const item of favourites) {
        await removeFavourite(item.book_id);
      }

      setSnackbar({
        open: true,
        message: "Đã xóa tất cả sách khỏi danh sách yêu thích",
        severity: "success",
      });
    } catch (error) {
      logger.error("Error clearing all favorites:", error);
      setSnackbar({
        open: true,
        message: "Không thể xóa tất cả. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setClearingAll(false);
    }
  };

  const handleAddToCart = async (
    e: React.MouseEvent,
    bookId: number,
    bookTitle: string,
    availableCount: number
  ) => {
    e.stopPropagation();
    if (availableCount <= 0) {
      setSnackbar({
        open: true,
        message: "Sách hiện hết bản",
        severity: "error",
      });
      return;
    }

    try {
      await addToCart({
        bookId,
        quantity: 1,
        bookAvailableCount: availableCount,
        bookData: {
          title: bookTitle,
          author_names: null,
          thumbnail_url: "",
          bookAvailableCount: availableCount,
        },
      });

      const displayTitle =
        bookTitle.length > 35 ? bookTitle.slice(0, 35) + "..." : bookTitle;
      setSnackbar({
        open: true,
        message: `Thêm "${displayTitle}" vào giỏ mượn thành công`,
        severity: "success",
      });
    } catch (error) {
      logger.error("Error adding to cart:", error);
      const backendError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        backendError?.response?.data?.message ||
        "Không thể thêm sách vào giỏ. Vui lòng thử lại.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleBorrowNow = async (
    e: React.MouseEvent,
    bookId: number,
    bookTitle: string,
    availableCount: number
  ) => {
    e.stopPropagation();
    if (availableCount <= 0) {
      setSnackbar({
        open: true,
        message: "Sách hiện hết bản",
        severity: "error",
      });
      return;
    }

    try {
      await addToCart({
        bookId,
        quantity: 1,
        bookAvailableCount: availableCount,
        bookData: {
          title: bookTitle,
          author_names: null,
          thumbnail_url: "",
          bookAvailableCount: availableCount,
        },
      });

      const borrowResponse = await borrowApi.createBorrow({
        items: [{ book_id: bookId, quantity: 1 }],
      });

      if (borrowResponse.success && borrowResponse.data?.borrowId) {
        try {
          await borrowApi.clearCart();
        } catch (clearError) {
          logger.warn("Failed to clear cart:", clearError);
        }

        navigate(`/borrow/confirm/${borrowResponse.data.borrowId}`);
      } else {
        throw new Error("Không thể tạo phiếu mượn");
      }
    } catch (error) {
      logger.error("Error borrowing book:", error);
      const backendError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        backendError?.response?.data?.message ||
        "Không thể mượn sách. Vui lòng thử lại.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
        >
          Sách yêu thích
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={280} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!favourites || favourites.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
        >
          Sách yêu thích
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Hãy thêm những cuốn sách bạn yêu thích vào đây
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/catalog")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Khám phá sách
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Sách yêu thích
          </Typography>
          <Chip
            label={`${favourites.length} cuốn`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Button
          variant="outlined"
          color="error"
          size={isMobile ? "small" : "medium"}
          startIcon={<Trash2 size={18} />}
          onClick={handleClearAll}
          disabled={clearingAll || favourites.length === 0}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {clearingAll ? "Đang xóa..." : "Xóa tất cả"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {favourites.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
            <Card
              onClick={() => navigate(`/books/${item.book_id}`)}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                position: "relative",
                border: `1px solid`,
                borderColor: "divider",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: { xs: "none", sm: "translateY(-4px)" },
                  boxShadow: {
                    xs: "none",
                    sm:
                      theme.palette.mode === "dark"
                        ? "0 6px 20px rgba(129,140,248,0.2)"
                        : "0 6px 20px rgba(99,102,241,0.12)",
                  },
                },
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  "&:last-child": { pb: { xs: 1.5, sm: 2 } },
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <Stack
                  direction={{ xs: "row", sm: "column" }}
                  spacing={{ xs: 1.5, sm: 2.5 }}
                  alignItems={{ xs: "flex-start", sm: "stretch" }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {item.thumbnail_url && (
                    <Box
                      component="img"
                      src={item.thumbnail_url}
                      alt={item.title}
                      sx={{
                        width: { xs: 95, sm: "100%" },
                        height: { xs: "auto", sm: "auto" },
                        aspectRatio: "2/3",
                        objectFit: "cover",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {!item.thumbnail_url && (
                    <Box
                      sx={{
                        width: { xs: 90, sm: "100%" },
                        height: { xs: "auto", sm: "auto" },
                        maxHeight: 100,
                        aspectRatio: { xs: "2/3", sm: "2/3" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    >
                      <MenuBook
                        sx={{
                          fontSize: { xs: 50, sm: 64 },
                          color: "grey.400",
                        }}
                      />
                    </Box>
                  )}

                  <Stack
                    spacing={{ xs: 1, sm: 1 }}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mt: { xs: 0, sm: 2 },
                        height: { xs: "2.3rem", sm: "2.6rem" },
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                    >
                      {item.author_names || " "}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: { xs: "none", sm: "block" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minHeight: { xs: "auto", sm: "1.125rem" },
                        minWidth: 0,
                      }}
                    >
                      {item.publisher_name
                        ? `NXB: ${item.publisher_name}`
                        : " "}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        mt: { xs: 1, sm: 0.5 },
                      }}
                    >
                      {(item.available_count ?? 0) > 0 ? (
                        <Chip
                          label={`Còn ${item.available_count} cuốn`}
                          size="small"
                          color="success"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.7rem" },
                            height: { xs: 28, sm: 20 },
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <Chip
                          label="Hết sách"
                          size="small"
                          color="error"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.7rem" },
                            height: { xs: 28, sm: 20 },
                            borderRadius: "5px",
                          }}
                        />
                      )}
                    </Box>

                    {isMobile && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mt: 1, width: "100%" }}
                      >
                        <Button
                          variant="contained"
                          size="medium"
                          onClick={(e) =>
                            handleBorrowNow(
                              e,
                              item.book_id,
                              item.title,
                              item.available_count ?? 0
                            )
                          }
                          disabled={(item.available_count ?? 0) === 0}
                          sx={{
                            minWidth: 0,
                            px: 2,
                            py: 0.5,
                            fontSize: { xs: "0.85rem", sm: "0.8rem" },
                            fontWeight: 600,
                            textTransform: "none",
                            flex: 1,
                            height: 32,
                          }}
                        >
                          Mượn ngay
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          startIcon={
                            <ShoppingCartOutlined
                              sx={{ fontSize: { xs: 16, sm: 18 } }}
                            />
                          }
                          onClick={(e) =>
                            handleAddToCart(
                              e,
                              item.book_id,
                              item.title,
                              item.available_count ?? 0
                            )
                          }
                          disabled={(item.available_count ?? 0) === 0}
                          sx={{
                            minWidth: 0,
                            px: 1.5,
                            py: 0.5,
                            fontSize: { xs: "0.85rem", sm: "0.8rem" },
                            fontWeight: 600,
                            textTransform: "none",
                            borderColor: "divider",
                            width: 60,
                            height: 32,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "4px",

                            "& .MuiButton-startIcon": {
                              margin: 0,
                            },

                            "&:hover": {
                              borderColor: "primary.main",
                              bgcolor: "rgba(79, 70, 229, 0.04)",
                            },
                          }}
                        ></Button>
                        <IconButton
                          size="small"
                          onClick={(e) =>
                            handleRemove(e, item.book_id, item.title)
                          }
                          disabled={removingIds.has(item.book_id)}
                          sx={{
                            color: "error.main",
                            width: 40,
                            height: 32,
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(248, 113, 113, 0.12)"
                                  : "rgba(239, 68, 68, 0.08)",
                            },
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </Stack>

                {!isMobile && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: "auto",
                      pt: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) =>
                        handleBorrowNow(
                          e,
                          item.book_id,
                          item.title,
                          item.available_count ?? 0
                        )
                      }
                      disabled={(item.available_count ?? 0) === 0}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        py: 0.75,
                        px: 1.5,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      Mượn
                    </Button>
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        handleAddToCart(
                          e,
                          item.book_id,
                          item.title,
                          item.available_count ?? 0
                        )
                      }
                      disabled={(item.available_count ?? 0) === 0}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        width: 70,
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(79, 70, 229, 0.04)",
                        },
                      }}
                    >
                      <ShoppingCartOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleRemove(e, item.book_id, item.title)}
                      disabled={removingIds.has(item.book_id)}
                      sx={{
                        color: "error.main",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        "&:hover": {
                          borderColor: "error.main",
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(248, 113, 113, 0.12)"
                              : "rgba(239, 68, 68, 0.08)",
                        },
                      }}
                    >
                      <Trash2 size={22} />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
    </Container>
  );
}
