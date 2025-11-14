import { borrowApi } from "../api/borrow.api";
import logger from "../../../shared/lib/logger";
import type { CartItem } from "../../../context/CartContext";

export interface CartValidationError {
  code:
    | "INSUFFICIENT_STOCK"
    | "OUT_OF_STOCK"
    | "ALREADY_AT_MAX"
    | "CONFLICT"
    | "UNKNOWN";
  message: string;
  bookId: number;
  requested: number;
  available: number;
  currentInCart: number;
}

export interface AddToCartResult {
  success: boolean;
  error?: CartValidationError;
  shouldRetry?: boolean;
  cartData?: {
    items: CartItem[];
    totalBooks: number;
    totalCopies: number;
  };
}

export class CartService {
  private static pendingRequests = new Map<number, Promise<AddToCartResult>>();

  static async addToCart(
    bookId: number,
    quantity: number,
    currentCart: { items: CartItem[]; totalBooks: number; totalCopies: number },
    bookAvailableCount: number
  ): Promise<AddToCartResult> {
    const pendingRequest = this.pendingRequests.get(bookId);
    if (pendingRequest) {
      logger.warn(
        `[CartService] Request already pending for book ${bookId}, reusing`
      );
      return pendingRequest;
    }

    const validationError = this.validateAddToCart(
      bookId,
      quantity,
      currentCart,
      bookAvailableCount
    );

    if (validationError) {
      logger.warn(
        `[CartService] Validation failed for book ${bookId}:`,
        validationError
      );
      return {
        success: false,
        error: validationError,
        shouldRetry: false,
      };
    }

    const requestPromise = this.executeAddToCart(
      bookId,
      quantity,
      currentCart,
      bookAvailableCount
    );
    this.pendingRequests.set(bookId, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(bookId);
    }
  }

  private static validateAddToCart(
    bookId: number,
    quantity: number,
    currentCart: { items: CartItem[] },
    bookAvailableCount: number
  ): CartValidationError | null {
    const existingItem = currentCart.items.find(
      (item) => item.bookId === bookId
    );
    const currentInCart = existingItem?.quantity || 0;
    const totalAfterAdd = currentInCart + quantity;

    const freshAvailableCount =
      existingItem?.available_count ?? bookAvailableCount;

    if (freshAvailableCount <= 0) {
      return {
        code: "OUT_OF_STOCK",
        message: "Sách này hiện đã hết bản",
        bookId,
        requested: quantity,
        available: freshAvailableCount,
        currentInCart,
      };
    }

    if (totalAfterAdd > freshAvailableCount) {
      if (currentInCart >= freshAvailableCount) {
        return {
          code: "ALREADY_AT_MAX",
          message: `Bạn đã có tối đa ${currentInCart} bản trong giỏ (tổng có ${freshAvailableCount} bản)`,
          bookId,
          requested: quantity,
          available: freshAvailableCount,
          currentInCart,
        };
      }

      return {
        code: "INSUFFICIENT_STOCK",
        message: `Chỉ còn ${freshAvailableCount} bản, bạn đã có ${currentInCart} bản trong giỏ. Không thể thêm ${quantity} bản nữa`,
        bookId,
        requested: quantity,
        available: freshAvailableCount,
        currentInCart,
      };
    }

    return null;
  }

  private static async executeAddToCart(
    bookId: number,
    quantity: number,
    currentCart: { items: CartItem[] },
    bookAvailableCount: number
  ): Promise<AddToCartResult> {
    try {
      logger.debug(`[CartService] Adding book ${bookId}, quantity ${quantity}`);

      const response = await borrowApi.addToCart(bookId, quantity);
      const data = response.data as unknown as {
        success: boolean;
        data?: {
          items: Array<{
            book_id: number;
            quantity: number;
            title: string;
            author_names?: string;
            thumbnail_url: string;
            available_count: number;
          }>;
          summary: { totalItems: number; totalBooks: number };
        };
      };

      if (!data.success || !data.data) {
        throw new Error("Invalid response from server");
      }

      const items: CartItem[] = data.data.items.map((item) => ({
        bookId: item.book_id,
        title: item.title,
        author_names: item.author_names || null,
        thumbnail_url: item.thumbnail_url,
        quantity: item.quantity,
        available_count: item.available_count,
      }));

      logger.info(`[CartService] Successfully added book ${bookId} to cart`);

      return {
        success: true,
        cartData: {
          items,
          totalBooks: data.data.summary.totalBooks,
          totalCopies: data.data.summary.totalItems,
        },
      };
    } catch (error: unknown) {
      logger.error("[CartService] Add to cart failed:", error);

      const err = error as {
        response?: {
          data?: { message?: string; code?: string };
          status?: number;
        };
      };
      const backendError = err?.response?.data;
      const statusCode = err?.response?.status;
      const backendErrorCode = backendError?.code;

      const existingItemInCart = currentCart.items.find(
        (item) => item.bookId === bookId
      );
      const currentInCart = existingItemInCart?.quantity || 0;

      if (statusCode === 400) {
        if (backendErrorCode === "OUT_OF_STOCK") {
          return {
            success: false,
            error: {
              code: "OUT_OF_STOCK",
              message: backendError?.message || "Sách này hiện đã hết bản",
              bookId,
              requested: quantity,
              available: 0,
              currentInCart,
            },
            shouldRetry: false,
          };
        }

        if (backendErrorCode === "EXCEEDS_AVAILABILITY") {
          return {
            success: false,
            error: {
              code: "INSUFFICIENT_STOCK",
              message: backendError?.message || "Không đủ số lượng sách có sẵn",
              bookId,
              requested: quantity,
              available: 0,
              currentInCart,
            },
            shouldRetry: true,
          };
        }

        const errorMessage = backendError?.message || "";

        if (
          errorMessage.includes("hết bản") ||
          errorMessage.includes("out of stock")
        ) {
          return {
            success: false,
            error: {
              code: "OUT_OF_STOCK",
              message: errorMessage,
              bookId,
              requested: quantity,
              available: 0,
              currentInCart,
            },
            shouldRetry: false,
          };
        }

        if (
          errorMessage.includes("chỉ còn") ||
          errorMessage.includes("không đủ") ||
          errorMessage.includes("exceed")
        ) {
          return {
            success: false,
            error: {
              code: "INSUFFICIENT_STOCK",
              message: errorMessage,
              bookId,
              requested: quantity,
              available: 0,
              currentInCart,
            },
            shouldRetry: true,
          };
        }

        return {
          success: false,
          error: {
            code: "INSUFFICIENT_STOCK",
            message:
              backendError?.message ||
              "Không thể thêm sách vào giỏ. Vui lòng kiểm tra lại số lượng",
            bookId,
            requested: quantity,
            available: bookAvailableCount,
            currentInCart,
          },
          shouldRetry: true,
        };
      }

      if (statusCode === 409) {
        return {
          success: false,
          error: {
            code: "CONFLICT",
            message:
              "Có người khác vừa mượn cuốn sách này. Vui lòng thử lại sau vài giây.",
            bookId,
            requested: quantity,
            available: 0,
            currentInCart,
          },
          shouldRetry: true,
        };
      }

      return {
        success: false,
        error: {
          code: "UNKNOWN",
          message:
            backendError?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
          bookId,
          requested: quantity,
          available: bookAvailableCount,
          currentInCart,
        },
        shouldRetry: true,
      };
    }
  }

  static async updateQuantity(
    bookId: number,
    newQuantity: number,
    currentCart: { items: CartItem[] }
  ): Promise<AddToCartResult> {
    const item = currentCart.items.find((i) => i.bookId === bookId);
    if (!item) {
      return {
        success: false,
        error: {
          code: "UNKNOWN",
          message: "Sách không tồn tại trong giỏ",
          bookId,
          requested: newQuantity,
          available: 0,
          currentInCart: 0,
        },
        shouldRetry: false,
      };
    }

    const availableCount = item.available_count || 0;

    if (newQuantity > availableCount) {
      return {
        success: false,
        error: {
          code: "INSUFFICIENT_STOCK",
          message: `Chỉ còn ${availableCount} bản trong kho`,
          bookId,
          requested: newQuantity,
          available: availableCount,
          currentInCart: item.quantity,
        },
        shouldRetry: false,
      };
    }

    try {
      const response = await borrowApi.updateCartQuantity(bookId, newQuantity);
      const data = response.data as unknown as {
        success: boolean;
        data?: {
          items: Array<{
            book_id: number;
            quantity: number;
            title: string;
            author_names?: string;
            thumbnail_url: string;
            available_count: number;
          }>;
          summary: { totalItems: number; totalBooks: number };
        };
      };

      if (!data.success || !data.data) {
        throw new Error("Invalid response from server");
      }

      const items: CartItem[] = data.data.items.map((item) => ({
        bookId: item.book_id,
        title: item.title,
        author_names: item.author_names || null,
        thumbnail_url: item.thumbnail_url,
        quantity: item.quantity,
        available_count: item.available_count,
      }));

      return {
        success: true,
        cartData: {
          items,
          totalBooks: data.data.summary.totalBooks,
          totalCopies: data.data.summary.totalItems,
        },
      };
    } catch (error: unknown) {
      logger.error("[CartService] Update quantity failed:", error);

      const err = error as { response?: { data?: { message?: string } } };
      const backendError = err?.response?.data;
      return {
        success: false,
        error: {
          code: "UNKNOWN",
          message:
            backendError?.message ||
            "Không thể cập nhật số lượng. Vui lòng thử lại.",
          bookId,
          requested: newQuantity,
          available: availableCount,
          currentInCart: item.quantity,
        },
        shouldRetry: true,
      };
    }
  }

  static getErrorMessage(
    error: CartValidationError,
    bookTitle?: string
  ): string {
    const maxTitleLength = 40;
    let title = bookTitle || "Sách này";
    if (title.length > maxTitleLength) {
      title = title.substring(0, maxTitleLength) + "...";
    }

    switch (error.code) {
      case "OUT_OF_STOCK":
        return `"${title}" hiện đã hết`;

      case "ALREADY_AT_MAX":
        return `Đã có ${error.currentInCart} bản trong giỏ (tối đa ${error.available})`;

      case "INSUFFICIENT_STOCK":
        if (error.currentInCart > 0) {
          return `Chỉ còn ${error.available} bản, bạn đã có ${error.currentInCart} trong giỏ`;
        }
        return `"${title}" chỉ còn ${error.available} bản`;

      case "CONFLICT":
        return "Có người vừa mượn sách này. Thử lại sau.";

      default:
        return error.message || "Không thể thêm vào giỏ";
    }
  }
}
