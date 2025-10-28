import React, { useRef, useEffect } from "react";
import {
  Popper,
  Fade,
  Paper,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import { Search, ArrowRight } from "@mui/icons-material";
import type { Book } from "../../features/books/types";

interface SearchResultsPanelProps {
  results: Book[];
  isLoading: boolean;
  isOpen: boolean;
  query: string;
  onClose: () => void;
  onSelectBook: (bookId: number) => void;
  onViewAll: () => void;
  anchorEl: HTMLElement | null;
}

export default function SearchResultsPanel({
  results,
  isLoading,
  isOpen,
  query,
  onClose,
  onSelectBook,
  onViewAll,
  anchorEl,
}: SearchResultsPanelProps): React.ReactElement | null {
  const theme = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const [popperWidth, setPopperWidth] = React.useState<number>(400);

  React.useEffect(() => {
    if (anchorEl && isOpen) {
      const rect = anchorEl.getBoundingClientRect();
      setPopperWidth(rect.width);
    }
  }, [anchorEl, isOpen]);

  // đóng khi click ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, anchorEl]);

  // reset khi mở mới
  React.useEffect(() => {
    if (isOpen) setSelectedIndex(-1);
  }, [isOpen, results.length]);

  // hỗ trợ điều hướng bằng mũi tên bàn phím
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onSelectBook(results[selectedIndex].id);
        } else {
          onViewAll();
        }
        break;
      case "Escape":
        event.preventDefault();
        onClose();
        break;
    }
  };

  const handleBookClick = (bookId: number) => {
    onSelectBook(bookId);
    onClose();
  };

  const handleViewAllClick = () => {
    onViewAll();
    onClose();
  };

  if (!isOpen || !query || query.trim().length < 2) return null;

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      modifiers={[
        { name: "offset", options: { offset: [0, 6] } },
        { name: "preventOverflow", options: { padding: 8, mainAxis: false } },
        { name: "flip", enabled: false },
      ]}
      sx={{ zIndex: theme.zIndex.modal, position: "fixed" }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={120}>
          <Paper
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
            sx={{
              width: popperWidth,
              maxWidth: "90vw",
              maxHeight: 480,
              overflowY: "auto",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              boxShadow: theme.shadows[8],
              outline: "none",
            }}
            role="listbox"
            aria-label="Kết quả tìm kiếm sách"
          >
            {/* loading */}
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <CircularProgress size={32} />
              </Box>
            ) : results.length > 0 ? (
              <>
                <List sx={{ py: 0 }}>
                  {results.map((book, index) => (
                    <React.Fragment key={book.id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleBookClick(book.id)}
                          selected={index === selectedIndex}
                          sx={{
                            py: 1.4,
                            px: 2,
                            alignItems: "flex-start",
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "light"
                                  ? "rgba(99,102,241,0.04)"
                                  : "rgba(129,140,248,0.08)",
                            },
                            "&.Mui-selected": {
                              bgcolor:
                                theme.palette.mode === "light"
                                  ? "rgba(99,102,241,0.08)"
                                  : "rgba(129,140,248,0.12)",
                              "&:hover": {
                                bgcolor:
                                  theme.palette.mode === "light"
                                    ? "rgba(99,102,241,0.12)"
                                    : "rgba(129,140,248,0.16)",
                              },
                            },
                          }}
                          role="option"
                          aria-selected={index === selectedIndex}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={
                                book.thumbnail_url || "/placeholder-book.png"
                              }
                              alt={book.title}
                              variant="rounded"
                              sx={{
                                width: 48,
                                height: 64,
                                mr: 1,
                                boxShadow: 1,
                                bgcolor: "grey.200",
                              }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  fontSize: "0.9rem",
                                  mb: 0.25,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {book.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.8rem",
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {book.author_names || "Không rõ tác giả"}
                                {book.publication_year &&
                                  ` • ${book.publication_year}`}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < results.length - 1 && (
                        <Divider component="li" sx={{ mx: 2 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>

                <Divider />

                <Box sx={{ p: 1.5 }}>
                  <Button
                    fullWidth
                    onClick={handleViewAllClick}
                    endIcon={<ArrowRight />}
                    sx={{
                      justifyContent: "space-between",
                      color: "primary.main",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      py: 1,
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "light"
                            ? "rgba(99,102,241,0.04)"
                            : "rgba(129,140,248,0.08)",
                      },
                    }}
                  >
                    Hiển thị thêm kết quả
                  </Button>
                </Box>
              </>
            ) : (
              // empty
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                  px: 2,
                }}
              >
                <Search
                  sx={{
                    fontSize: 48,
                    color: "text.disabled",
                    mb: 1.5,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    fontSize: "0.875rem",
                  }}
                >
                  Không tìm thấy sách phù hợp với "{query}"
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.disabled",
                    textAlign: "center",
                    mt: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Thử tìm kiếm với từ khóa khác
                </Typography>
              </Box>
            )}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
