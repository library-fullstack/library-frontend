import React, { useContext } from "react";
import { IconButton, Button, CircularProgress, Tooltip } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FavouritesContext from "../../../context/FavouritesContext";
import { AuthContext } from "../../../context/AuthContext.context";
import logger from "../../../shared/lib/logger";

interface FavouriteButtonProps {
  bookId: number;
  bookTitle?: string;
  variant?: "icon" | "button";
  size?: "small" | "medium" | "large";
  color?: "default" | "primary" | "secondary" | "error";
  fullWidth?: boolean;
  onNotify?: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
}

export default function FavouriteButton({
  bookId,
  bookTitle,
  variant = "icon",
  size = "medium",
  color = "default",
  fullWidth = false,
  onNotify,
}: FavouriteButtonProps): React.ReactElement {
  const favouritesContext = useContext(FavouritesContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { user } = authContext || {};
  const { isFavourite, toggleFavourite, loading } = favouritesContext || {};

  const [isToggling, setIsToggling] = React.useState(false);
  const isFav = isFavourite?.(bookId) || false;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth/login", {
        state: { from: window.location.pathname },
      });
      return;
    }

    if (!toggleFavourite) {
      logger.error("toggleFavourite function not available");
      onNotify?.("Có lỗi xảy ra, vui lòng thử lại", "error");
      return;
    }

    setIsToggling(true);
    try {
      await toggleFavourite(bookId);
      const action = isFav ? "xóa khỏi" : "thêm vào";
      const message = bookTitle
        ? `Đã ${action} danh sách yêu thích: "${bookTitle.length > 40 ? bookTitle.slice(0, 40) + "..." : bookTitle}"`
        : `Đã ${action} danh sách yêu thích`;
      onNotify?.(message, "success");
    } catch (error) {
      logger.error("Error toggling favourite:", error);
      const backendError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        backendError?.response?.data?.message ||
        "Không thể cập nhật danh sách yêu thích. Vui lòng thử lại.";
      onNotify?.(errorMessage, "error");
    } finally {
      setIsToggling(false);
    }
  };

  const isDisabled = loading || isToggling;

  if (variant === "icon") {
    return (
      <Tooltip
        title={
          !user
            ? "Đăng nhập để thêm vào yêu thích"
            : isFav
            ? "Xóa khỏi yêu thích"
            : "Thêm vào yêu thích"
        }
      >
        <span>
          <IconButton
            onClick={handleToggle}
            disabled={isDisabled}
            size={size}
            color={isFav ? "error" : color}
            sx={{
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            {isToggling ? (
              <CircularProgress size={size === "small" ? 16 : 24} />
            ) : isFav ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Button
      variant={isFav ? "contained" : "outlined"}
      size={size}
      fullWidth={fullWidth}
      onClick={handleToggle}
      disabled={isDisabled}
      color={isFav ? "error" : "primary"}
      startIcon={
        isToggling ? (
          <CircularProgress size={16} />
        ) : isFav ? (
          <Favorite />
        ) : (
          <FavoriteBorder />
        )
      }
      sx={{
        fontWeight: 600,
        textTransform: "none",
        py: 1.5,
      }}
    >
      {isToggling ? "Đang xử lý..." : isFav ? "Đã thích" : "Yêu thích"}
    </Button>
  );
}
