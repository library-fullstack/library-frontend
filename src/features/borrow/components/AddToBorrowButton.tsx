import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAddToCart, useCart } from "../hooks/useCart";
import logger from "../../../shared/lib/logger";
import { useCurrentUser } from "../../users/hooks/useUser";

interface AddToBorrowButtonProps {
  bookId: number;
  bookTitle?: string;
  available_count?: number | null;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  quantity?: number;
  onNotify?: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
}

export default function AddToBorrowButton({
  bookId,
  bookTitle,
  available_count,
  variant = "contained",
  size = "medium",
  fullWidth = false,
  quantity = 1,
  onNotify,
}: AddToBorrowButtonProps): React.ReactElement {
  const { data: user } = useCurrentUser();
  const { data: cart } = useCart(!!user);
  const { mutateAsync: addItem, isPending: isAdding } = useAddToCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      navigate("/auth/login", {
        state: { from: { pathname: "/borrow/cart" } },
      });
      return;
    }

    if (!cart) {
      const msg = "Đang tải giỏ hàng, vui lòng đợi...";
      onNotify?.(msg, "info");
      return;
    }

    const existingItem = cart.items.find((item) => item.bookId === bookId);
    const freshAvailableCount =
      existingItem?.available_count ?? available_count ?? 0;

    if (freshAvailableCount <= 0) {
      const msg = "Sách hiện hết bản";
      onNotify?.(msg, "error");
      return;
    }

    const currentQuantityInCart = existingItem?.quantity || 0;
    const totalAfterAdd = currentQuantityInCart + quantity;

    if (totalAfterAdd > freshAvailableCount) {
      const bookName = bookTitle || existingItem?.title || "Sách này";
      const displayName =
        bookName.length > 40 ? bookName.slice(0, 40) + "..." : bookName;
      const msg = `Bạn đã thêm hết "${displayName}" vào giỏ rồi! (${currentQuantityInCart}/${freshAvailableCount} quyển)`;
      onNotify?.(msg, "warning");
      return;
    }

    try {
      await addItem({
        bookId,
        quantity,
        bookAvailableCount: freshAvailableCount,
        bookData: bookTitle
          ? {
              title: bookTitle,
              author_names: null,
              thumbnail_url: "",
              bookAvailableCount: freshAvailableCount,
            }
          : undefined,
      });

      const bookName = bookTitle || existingItem?.title || "Sách";
      const displayName =
        bookName.length > 35 ? bookName.slice(0, 35) + "..." : bookName;
      const successMsg = `Thêm thành công "${displayName}" vào giỏ mượn`;
      onNotify?.(successMsg, "success");
    } catch (error) {
      logger.error("Error adding to cart:", error);

      const backendError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        backendError?.response?.data?.message ||
        "Không thể thêm sách vào giỏ. Vui lòng thử lại.";
      onNotify?.(errorMessage, "error");
    }
  };

  const currentItemInCart = cart?.items.find((item) => item.bookId === bookId);
  const freshAvailableCount =
    currentItemInCart?.available_count ?? available_count ?? 0;

  // SECURITY FIX: Removed console.log

  const isDisabled = freshAvailableCount <= 0 || isAdding;

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleAdd}
      disabled={isDisabled}
      sx={{
        fontWeight: 600,
        textTransform: "none",
      }}
    >
      {isDisabled && !isAdding
        ? "Hết bản"
        : isAdding
        ? "Đang thêm..."
        : "Thêm vào giỏ mượn"}
    </Button>
  );
}
