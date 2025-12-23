import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShoppingBag } from "lucide-react";
import { InfoOutlined, FavoriteBorder, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Book } from "../../features/books/types";
import FavouritesContext from "../../context/FavouritesContext";
import logger from "@/shared/lib/logger";

interface BookCardProps {
  book: Book;
  onAddToCart?: (bookId: number) => void;
  isAddingToCart?: boolean;
}

export default function BookCard({
  book,
  onAddToCart,
  isAddingToCart = false,
}: BookCardProps): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const cardRef = useRef<HTMLDivElement>(null);
  const favouritesContext = React.useContext(FavouritesContext);

  const { isFavourite, toggleFavourite } = favouritesContext || {};
  const [isTogglingFav, setIsTogglingFav] = React.useState(false);
  const isFav = isFavourite?.(book.id) || false;

  const handleViewDetail = () => {
    navigate(`/books/${book.id}`);
  };

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!toggleFavourite) return;

    setIsTogglingFav(true);
    try {
      await toggleFavourite(book.id);
    } catch (_error) {
      logger.error("Error toggling favourite for book", _error);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const isAvailable = (book.available_count ?? 0) > 0;

  return (
    <Card
      ref={cardRef}
      sx={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 2px 8px rgba(0,0,0,0.04)"
            : "0 2px 8px rgba(0,0,0,0.2)",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${
            theme.palette.mode === "light"
              ? "rgba(79, 70, 229, 0.15)"
              : "rgba(129, 140, 248, 0.2)"
          }`,
          ...(!isMobile && {
            "& .book-actions": {
              opacity: 1,
              transform: "translateY(0)",
            },
            "& .book-overlay": {
              opacity: 1,
            },
          }),
        },
      }}
      onClick={handleViewDetail}
    >
      {/* book cover */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "133.33%",
          flexShrink: 0,
          bgcolor: theme.palette.mode === "light" ? "#F1F5F9" : "#2A2B33",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={
            book.thumbnail_url
              ? book.thumbnail_url.replace(
                  "/upload/",
                  "/upload/w_400,h_533,c_fill,g_center,q_auto,f_auto/"
                )
              : "https://via.placeholder.com/300x400/eeeeee/777777?text=No+Cover"
          }
          alt={book.title}
          loading="lazy"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* over khi hover vào sách - desktop*/}
        {!isMobile && (
          <>
            <Box
              className="book-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            />

            {/* xem chi tiết */}
            <Box
              className="book-actions"
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                display: "flex",
                gap: 1,
                opacity: 0,
                transform: "translateY(10px)",
                transition: "all 0.3s ease",
                zIndex: 1,
              }}
            >
              <Tooltip title="Xem chi tiết" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail();
                  }}
                  sx={{
                    bgcolor: "background.paper",
                    flex: 1,
                    borderRadius: 2,
                    height: 36,
                    backdropFilter: "blur(10px)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
                    },
                  }}
                >
                  <InfoOutlined
                    fontSize="small"
                    sx={{
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={isFav ? "Bỏ yêu thích" : "Yêu thích"}
                arrow
                placement="top"
              >
                <IconButton
                  size="small"
                  disabled={isTogglingFav}
                  onClick={handleToggleFavourite}
                  sx={{
                    bgcolor: "background.paper",
                    flex: 1,
                    borderRadius: 2,
                    height: 36,
                    backdropFilter: "blur(10px)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "error.main",
                      color: "#fff",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
                    },
                  }}
                >
                  {isFav ? (
                    <Favorite
                      fontSize="small"
                      sx={{
                        color: "error.main",
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                      }}
                    />
                  ) : (
                    <FavoriteBorder
                      fontSize="small"
                      sx={{
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  isAddingToCart
                    ? "Đang thêm..."
                    : isAvailable
                    ? "Thêm vào giỏ"
                    : "Hết sách"
                }
                arrow
                placement="top"
              >
                <span style={{ flex: 1 }}>
                  <IconButton
                    size="small"
                    disabled={!isAvailable || isAddingToCart}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (isAvailable && !isAddingToCart && onAddToCart) {
                        onAddToCart(book.id);
                      }
                    }}
                    sx={{
                      bgcolor: "background.paper",
                      width: "100%",
                      borderRadius: 2,
                      height: 36,
                      backdropFilter: "blur(10px)",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: isAvailable ? "primary.main" : undefined,
                        color: isAvailable ? "#fff" : undefined,
                        transform: isAvailable ? "translateY(-2px)" : undefined,
                        boxShadow: isAvailable
                          ? "0 4px 12px rgba(79, 70, 229, 0.4)"
                          : undefined,
                      },
                      "&.Mui-disabled": {
                        bgcolor: "rgba(0,0,0,0.08)",
                        opacity: isAddingToCart ? 0.6 : 0.4,
                      },
                    }}
                  >
                    <ShoppingBag
                      size={18}
                      style={{
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                        animation: isAddingToCart
                          ? "pulse 1.5s ease-in-out infinite"
                          : undefined,
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </>
        )}
      </Box>

      {/* thông tin sách */}
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
          flex: 1,
          "&:last-child": { pb: { xs: 1.5, sm: 2 } },
        }}
      >
        {/* loại sách */}
        {book.category_name && (
          <Chip
            label={book.category_name}
            size="small"
            sx={{
              alignSelf: "flex-start",
              borderRadius: 1,
              mb: { xs: 1, sm: 1.5 },
              maxWidth: "100%",
              height: { xs: 22, sm: 26 },
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              fontWeight: 700,
              letterSpacing: "0.02em",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(79, 70, 229, 0.08)"
                  : "rgba(129, 140, 248, 0.1)",
              color: "primary.main",
              border: 1,
              borderColor:
                theme.palette.mode === "light"
                  ? "rgba(79, 70, 229, 0.2)"
                  : "rgba(129, 140, 248, 0.3)",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "light"
                    ? "rgba(79, 70, 229, 0.12)"
                    : "rgba(129, 140, 248, 0.15)",
                transform: "translateY(-1px)",
              },
              "& .MuiChip-icon": {
                color: "primary.main",
              },
              "& .MuiChip-label": {
                px: { xs: 0.5, sm: 1 },
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        )}

        {/* tiêu đề */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            mb: { xs: 0.5, sm: 0.75 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            height: { xs: "2.6em", sm: "2.6em" },
            letterSpacing: "-0.01em",
            fontSize: { xs: "0.8rem", sm: "0.95rem" },
          }}
        >
          {book.title}
        </Typography>

        {/* tác giả */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: { xs: 0.75, sm: 1 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {book.author_names || "Chưa rõ tác giả"}
        </Typography>

        {/* năm xuất bản */}
        {book.publication_year && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: { xs: 1, sm: 1.25 },
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              lineHeight: 1.5,
            }}
          >
            {book.publication_year}
          </Typography>
        )}

        {/* thông tin trạng thái của sách */}
        <Box sx={{ pt: { xs: 0.5, sm: 0.75 }, mt: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              py: { xs: 0.5, sm: 0.75 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: !isAvailable
                    ? "#EF4444"
                    : (book.available_count ?? 0) <= 3
                    ? "#F59E0B"
                    : "#10B981",
                  flexShrink: 0,
                  transform: "translateY(0.5px)",
                  mb: 0.3,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: !isAvailable
                    ? "#EF4444"
                    : (book.available_count ?? 0) <= 3
                    ? "#F59E0B"
                    : "#10B981",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  lineHeight: 1,
                }}
              >
                {!isAvailable
                  ? "Hết sách"
                  : (book.available_count ?? 0) <= 3
                  ? `Sắp hết - Còn ${book.available_count} cuốn`
                  : `Còn ${book.available_count} cuốn`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
