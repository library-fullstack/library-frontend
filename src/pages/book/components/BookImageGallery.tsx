import React, { useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  useTheme,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  Close,
  ChevronLeft,
  ChevronRight,
  MenuBook,
} from "@mui/icons-material";
import type { BookImage } from "../../../features/books/types";

interface BookImageGalleryProps {
  images: BookImage[];
  title: string;
  mainImage?: string;
}

export default function BookImageGallery({
  images,
  title,
  mainImage,
}: BookImageGalleryProps): React.ReactElement {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const galleryImages = sortedImages.filter((img) => img.kind === "GALLERY");

  const allImages = mainImage
    ? [{ url: mainImage, alt_text: title }, ...galleryImages]
    : galleryImages;

  if (allImages.length === 0) {
    return (
      <Box
        sx={{
          position: "relative",
          paddingTop: "140%",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "action.hover",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 8px 24px rgba(0,0,0,0.12)"
              : "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
          }}
        >
          <MenuBook
            sx={{ fontSize: 80, color: "text.disabled", opacity: 0.3 }}
          />
        </Box>
      </Box>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            position: "relative",
            paddingTop: "140%",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "action.hover",
            mb: allImages.length > 1 ? 2 : 0,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 24px rgba(0,0,0,0.12)"
                : "0 8px 24px rgba(0,0,0,0.4)",
            cursor: "pointer",
            "&:hover": {
              "& .image-overlay": {
                opacity: 1,
              },
            },
          }}
          onClick={() => {
            setSelectedIndex(0);
            setDialogOpen(true);
          }}
        >
          <Box
            component="img"
            src={allImages[0].url}
            alt={allImages[0].alt_text || title}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {allImages.length > 1 && (
            <Box
              className="image-overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                py: 1,
                px: 2,
                opacity: 0,
                transition: "opacity 0.3s ease",
                textAlign: "center",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              +{allImages.length - 1} ảnh khác
            </Box>
          )}
        </Box>

        {allImages.length > 1 && (
          <ImageList cols={4} gap={8} sx={{ m: 0 }}>
            {allImages.slice(1, 5).map((image, index) => (
              <ImageListItem
                key={index}
                sx={{
                  cursor: "pointer",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: `2px solid ${theme.palette.divider}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => {
                  setSelectedIndex(index + 1);
                  setDialogOpen(true);
                }}
              >
                <Box
                  component="img"
                  src={image.url}
                  alt={image.alt_text || `${title} - ảnh ${index + 2}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.95)",
            boxShadow: "none",
          },
        }}
      >
        <IconButton
          onClick={() => setDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
            zIndex: 2,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <Close />
        </IconButton>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            p: 2,
          }}
        >
          {allImages.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  left: 16,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 16,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          <Box
            component="img"
            src={allImages[selectedIndex].url}
            alt={
              allImages[selectedIndex].alt_text ||
              `${title} - ảnh ${selectedIndex + 1}`
            }
            sx={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: "0.875rem",
            }}
          >
            {selectedIndex + 1} / {allImages.length}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
