import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { borrowApi } from "../api/borrow.api";
import logger from "../../../shared/lib/logger";
import type { CartItem } from "../types/borrow.types";

export const cartKeys = {
  all: ["cart"] as const,
  list: () => [...cartKeys.all, "list"] as const,
};

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

export interface BorrowCart {
  items: CartItem[];
  totalBooks: number;
  totalCopies: number;
}

const mapCartResponse = (response: CartResponse): BorrowCart => {
  const itemsArray = response?.data?.items || [];
  const summary = response?.data?.summary || { totalItems: 0, totalBooks: 0 };

  const items: CartItem[] = itemsArray.map((item) => {
    const cartItem: CartItem = {
      bookId: item.book_id,
      title: item.title || "",
      author_names: item.author_names || null,
      thumbnail_url: item.thumbnail_url || "",
      quantity: item.quantity,
      available_count: item.available_count || 0,
    };
    console.log(
      `[mapCartResponse] Book ${item.book_id}: quantity=${item.quantity}, available_count=${item.available_count}`
    );
    return cartItem;
  });

  return {
    items,
    totalBooks: summary.totalBooks,
    totalCopies: summary.totalItems,
  };
};

export function useCart(enabled: boolean = true) {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: async () => {
      logger.debug("[useCart] Fetching cart");
      const axiosResponse = await borrowApi.getCart();

      const response = axiosResponse.data as CartResponse;

      logger.debug("[useCart] Received response:", response);
      return mapCartResponse(response);
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      bookId: number;
      quantity: number;
      bookAvailableCount: number;
      bookData?: {
        title: string;
        author_names: string | null;
        thumbnail_url: string;
        bookAvailableCount: number;
      };
    }) => {
      logger.debug("[useAddToCart] Adding to cart:", params);

      const currentCart = queryClient.getQueryData<BorrowCart>(
        cartKeys.list()
      ) || {
        items: [],
        totalBooks: 0,
        totalCopies: 0,
      };

      const { CartService } = await import("../services/cart.service");
      return await CartService.addToCart(
        params.bookId,
        params.quantity,
        currentCart,
        params.bookAvailableCount
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.list() });

      const previousCart = queryClient.getQueryData<BorrowCart>(
        cartKeys.list()
      );

      logger.debug("[useCart] No optimistic update - waiting for server");

      return { previousCart };
    },
    onSuccess: (result, _variables) => {
      if (result.success && result.cartData) {
        logger.debug("[useAddToCart] Success, updating cart with server data");
        queryClient.setQueryData<BorrowCart>(cartKeys.list(), result.cartData);
      } else {
        logger.warn("[useAddToCart] Validation failed:", result.error);
        throw result;
      }
    },
    onError: (error: unknown, variables, context) => {
      logger.error("[useAddToCart] Error:", error);

      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.list(), context.previousCart);
      }

      throw error;
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: number) => {
      logger.debug("[useRemoveFromCart] Removing from cart:", bookId);
      const response = await borrowApi.removeFromCart(bookId);
      return response.data as unknown as CartResponse;
    },
    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.list() });

      const previousCart = queryClient.getQueryData<BorrowCart>(
        cartKeys.list()
      );

      queryClient.setQueryData<BorrowCart>(cartKeys.list(), (old) => {
        if (!old) return old;

        const newItems = old.items.filter((i) => i.bookId !== bookId);

        return {
          items: newItems,
          totalBooks: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalCopies: newItems.length,
        };
      });

      return { previousCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<BorrowCart>(
        cartKeys.list(),
        mapCartResponse(data)
      );
    },
    onError: (err, variables, context) => {
      logger.error("[useRemoveFromCart] Failed:", err);
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.list(), context.previousCart);
      }
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { bookId: number; quantity: number }) => {
      logger.debug("[useUpdateCartQuantity] Updating quantity:", params);
      const response = await borrowApi.updateCartQuantity(
        params.bookId,
        params.quantity
      );
      logger.debug("[useUpdateCartQuantity] Response received:", response.data);
      return response.data as unknown as CartResponse;
    },
    onMutate: async ({ bookId, quantity }) => {
      logger.debug("[useUpdateCartQuantity] onMutate called");
      await queryClient.cancelQueries({ queryKey: cartKeys.list() });

      const previousCart = queryClient.getQueryData<BorrowCart>(
        cartKeys.list()
      );

      queryClient.setQueryData<BorrowCart>(cartKeys.list(), (old) => {
        if (!old) return old;

        const newItems = old.items.map((i) =>
          i.bookId === bookId ? { ...i, quantity } : i
        );

        return {
          items: newItems,
          totalBooks: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalCopies: newItems.length,
        };
      });

      return { previousCart };
    },
    onSuccess: (data) => {
      logger.debug("[useUpdateCartQuantity] onSuccess called with data:", data);
      queryClient.setQueryData<BorrowCart>(
        cartKeys.list(),
        mapCartResponse(data)
      );
    },
    onError: (err, variables, context) => {
      logger.error("[useUpdateCartQuantity] Error occurred:", err);
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.list(), context.previousCart);
      }
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      logger.debug("[useClearCart] Clearing cart");
      await borrowApi.clearCart();
    },
    onSuccess: () => {
      queryClient.setQueryData<BorrowCart>(cartKeys.list(), {
        items: [],
        totalBooks: 0,
        totalCopies: 0,
      });
    },
  });
}
