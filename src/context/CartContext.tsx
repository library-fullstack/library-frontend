import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { borrowApi } from "../features/borrow/api/borrow.api";
import { AuthContext } from "./AuthContext.context";
import logger from "../shared/lib/logger";
import { STORAGE_KEYS } from "../shared/lib/storageKeys";

export interface CartItem {
  bookId: number;
  title: string;
  author_names?: string | null;
  thumbnail_url?: string | null;
  quantity: number;
  available_count?: number | null;
  copies_count?: number | null;
}

export interface BorrowCart {
  items: CartItem[];
  totalBooks: number;
  totalCopies: number;
}

interface CartItemResponse {
  id: number;
  user_id: string;
  book_id: number;
  quantity: number;
  title: string;
  thumbnail_url: string;
  author_names?: string;
  available_count: number;
  created_at: string;
  updated_at: string;
}

interface CartResponse {
  success: boolean;
  data: {
    items: CartItemResponse[];
    summary: { totalItems: number; totalBooks: number };
  };
}

export interface CartContextType {
  cart: BorrowCart;
  loading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (bookId: number) => Promise<void>;
  updateQuantity: (bookId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = STORAGE_KEYS.cart.state;
const EMPTY_CART: BorrowCart = { items: [], totalBooks: 0, totalCopies: 0 };

const getStoredCart = (): BorrowCart => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      logger.debug("[CartContext] Loaded from localStorage");
      return parsed;
    }
  } catch (error) {
    logger.error("[CartContext] Failed to parse stored cart:", error);
  }
  logger.debug("[CartContext] No stored cart, returning empty");
  return { ...EMPTY_CART };
};

const saveCartToStorage = (cart: BorrowCart): void => {
  try {
    logger.debug("[CartContext] Saving to localStorage");
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    logger.error("[CartContext] Failed to save cart to localStorage:", error);
  }
};

const clearCartStorage = (): void => {
  try {
    logger.debug("[CartContext] Clearing localStorage");
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    logger.error(
      "[CartContext] Failed to clear cart from localStorage:",
      error
    );
  }
};

const calculateCartTotals = (
  items: CartItem[]
): { totalBooks: number; totalCopies: number } => {
  return {
    totalBooks: items.reduce((sum, item) => sum + item.quantity, 0),
    totalCopies: items.length,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<BorrowCart>(getStoredCart);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const authContext = React.useContext(AuthContext);
  const authUser = authContext?.user;
  const isAuthInitialized = authContext?.isInitialized ?? false;

  const updateCart = useCallback((newCart: BorrowCart) => {
    logger.debug(
      "[CartContext] updateCart called with items count:",
      newCart.items.length
    );
    setCart(newCart);
    if (newCart.items.length > 0) {
      saveCartToStorage(newCart);
    } else {
      clearCartStorage();
    }
  }, []);

  const updateCartFromResponse = useCallback(
    (
      data:
        | {
            items: CartItemResponse[];
            summary: { totalItems: number; totalBooks: number };
          }
        | {
            success: boolean;
            data: {
              items: CartItemResponse[];
              summary: { totalItems: number; totalBooks: number };
            };
          }
    ) => {
      logger.debug("[CartContext] updateCartFromResponse called");

      let actualData: {
        items: CartItemResponse[];
        summary: { totalItems: number; totalBooks: number };
      };

      if ("success" in data) {
        actualData = data.data;
      } else {
        actualData = data;
      }

      if (!actualData?.items || !Array.isArray(actualData.items)) {
        logger.debug("[CartContext] Invalid data, keeping current cart");
        return;
      }

      const items: CartItem[] = actualData.items.map(
        (item: CartItemResponse) => ({
          bookId: item.book_id,
          title: item.title || "",
          author_names: item.author_names || null,
          thumbnail_url: item.thumbnail_url || "",
          quantity: item.quantity,
          available_count: item.available_count || 0,
        })
      );

      const totals = calculateCartTotals(items);
      const newCart: BorrowCart = {
        items,
        totalBooks: totals.totalBooks,
        totalCopies: totals.totalCopies,
      };

      updateCart(newCart);
    },
    [updateCart]
  );

  const fetchCart = useCallback(async () => {
    if (!authUser?.id) {
      logger.debug("[CartContext] No authUser, skipping fetch");
      return;
    }

    if (isFetchingRef.current) {
      logger.debug("[CartContext] Already fetching, skipping");
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      logger.debug("[CartContext] Fetching cart");

      const response = await borrowApi.getCart();
      logger.debug("[CartContext] Cart fetched successfully");

      const data = response as unknown as CartResponse;

      if (data?.data) {
        updateCartFromResponse(data.data);
      } else {
        logger.debug(
          "[CartContext] No data in response, keeping localStorage cart"
        );
      }
    } catch (error) {
      logger.error("[CartContext] Failed to fetch cart:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [authUser?.id, updateCartFromResponse]);

  useEffect(() => {
    logger.debug("[CartContext] useEffect triggered");

    if (!isAuthInitialized) {
      logger.debug("[CartContext] Waiting for auth initialization");
      return;
    }

    if (authUser?.id) {
      logger.debug("[CartContext] Auth initialized with user, fetching cart");
      fetchCart();
    } else {
      logger.debug("[CartContext] No user, clearing cart");
      clearCartStorage();
      updateCart({ ...EMPTY_CART });
      setLoading(false);
    }
  }, [authUser?.id, isAuthInitialized, fetchCart, updateCart]);

  const addItem = useCallback(
    async (item: CartItem) => {
      const previousCart = cart;
      logger.debug("[CartContext] addItem called");

      try {
        const existingItem = cart.items.find((i) => i.bookId === item.bookId);
        const currentQuantity = existingItem?.quantity || 0;
        const availableCount = item.available_count || 0;
        const requestedQuantity = item.quantity;

        if (currentQuantity + requestedQuantity > availableCount) {
          throw new Error(
            `Chỉ còn ${availableCount} bản, bạn đã có ${currentQuantity} trong giỏ`
          );
        }

        const optimisticCart = { ...cart };
        if (existingItem) {
          const newQuantity = Math.min(
            currentQuantity + requestedQuantity,
            availableCount
          );
          optimisticCart.items = cart.items.map((i) =>
            i.bookId === item.bookId ? { ...i, quantity: newQuantity } : i
          );
        } else {
          const quantity = Math.min(requestedQuantity, availableCount);
          optimisticCart.items = [...cart.items, { ...item, quantity }];
        }

        const totals = calculateCartTotals(optimisticCart.items);
        optimisticCart.totalBooks = totals.totalBooks;
        optimisticCart.totalCopies = totals.totalCopies;

        updateCart(optimisticCart);

        const response = await borrowApi.addToCart(
          item.bookId,
          requestedQuantity
        );
        logger.debug("[CartContext] addToCart completed");

        const responseData = (
          response?.data as unknown as { data?: CartResponse["data"] }
        )?.data;

        if (responseData) {
          updateCartFromResponse(responseData);
        }
      } catch (error) {
        logger.error("[CartContext] addItem error:", error);
        updateCart(previousCart);
        throw error;
      }
    },
    [cart, updateCart, updateCartFromResponse]
  );

  const removeItem = useCallback(
    async (bookId: number) => {
      const previousCart = cart;
      logger.debug("[CartContext] removeItem called");

      try {
        const optimisticCart = {
          ...cart,
          items: cart.items.filter((i) => i.bookId !== bookId),
        };
        const totals = calculateCartTotals(optimisticCart.items);
        optimisticCart.totalBooks = totals.totalBooks;
        optimisticCart.totalCopies = totals.totalCopies;

        updateCart(optimisticCart);

        const response = await borrowApi.removeFromCart(bookId);
        const responseData = (
          response?.data as unknown as { data?: CartResponse["data"] }
        )?.data;

        if (responseData) {
          updateCartFromResponse(responseData);
        }
      } catch (error) {
        logger.error("[CartContext] removeItem error:", error);
        updateCart(previousCart);
        throw error;
      }
    },
    [cart, updateCart, updateCartFromResponse]
  );

  const updateQuantity = useCallback(
    async (bookId: number, quantity: number) => {
      const previousCart = cart;
      logger.debug("[CartContext] updateQuantity called");

      try {
        if (quantity <= 0) {
          await removeItem(bookId);
          return;
        }

        const item = cart.items.find((i) => i.bookId === bookId);
        if (!item) {
          throw new Error("Item not found in cart");
        }

        const availableCount = item.available_count || 0;
        if (quantity > availableCount) {
          throw new Error(`Chỉ còn ${availableCount} bản`);
        }

        const optimisticCart = {
          ...cart,
          items: cart.items.map((i) =>
            i.bookId === bookId ? { ...i, quantity } : i
          ),
        };
        const totals = calculateCartTotals(optimisticCart.items);
        optimisticCart.totalBooks = totals.totalBooks;
        optimisticCart.totalCopies = totals.totalCopies;

        updateCart(optimisticCart);

        const response = await borrowApi.updateCartQuantity(bookId, quantity);
        const responseData = (
          response?.data as unknown as { data?: CartResponse["data"] }
        )?.data;

        if (responseData) {
          updateCartFromResponse(responseData);
        }
      } catch (error) {
        logger.error("[CartContext] updateQuantity error:", error);
        updateCart(previousCart);
        throw error;
      }
    },
    [cart, removeItem, updateCart, updateCartFromResponse]
  );

  const clearCart = useCallback(async () => {
    const previousCart = cart;
    logger.debug("[CartContext] clearCart called");

    try {
      updateCart({ ...EMPTY_CART });
      await borrowApi.clearCart();
    } catch (error) {
      logger.error("[CartContext] Failed to clear cart:", error);
      updateCart(previousCart);
    }
  }, [cart, updateCart]);

  const value: CartContextType = {
    cart,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refetch: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
