import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { booksApi } from "@/features/books/api";
import type { BookFilters, SortOption } from "@/features/books/types";
import { CACHE_TIMES } from "@/shared/lib/cacheTimes";

// Query keys
export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (filters?: BookFilters, sort?: SortOption) =>
    [...bookKeys.lists(), { filters, sort }] as const,
  infinite: () => [...bookKeys.all, "infinite"] as const,
  infiniteList: (filters?: BookFilters, sort?: SortOption) =>
    [...bookKeys.infinite(), { filters, sort }] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: number) => [...bookKeys.details(), id] as const,
  count: () => [...bookKeys.all, "count"] as const,
};

/**
 * Hook để fetch danh sách sách với caching (legacy, cho compatibility)
 */
export function useBooks(params?: {
  keyword?: string;
  categoryId?: number;
  status?: string;
  searchType?: "all" | "author" | "title" | "publisher";
  sort_by?:
    | "newest"
    | "oldest"
    | "newest_added"
    | "oldest_added"
    | "title_asc"
    | "title_desc"
    | "popular";
  limit?: number;
  cursor?: number;
}) {
  return useQuery({
    queryKey: bookKeys.list(params as BookFilters | undefined),
    queryFn: async () => {
      return await booksApi.getAllBooks(params || { limit: 12 });
    },
    // Cache trong 5 phút
    ...CACHE_TIMES.NORMAL,
  });
}

/**
 * Hook để fetch infinite scroll danh sách sách (offset-based pagination)
 * Đơn giản và đáng tin cậy hơn cursor-based vì:
 * - Hoạt động tốt với complex ORDER BY clauses
 * - Không bị ảnh hưởng bởi ID gaps
 * - Dễ debug và maintain
 */
export function useBooksInfinite(params?: {
  keyword?: string;
  categoryId?: number;
  status?: string;
  searchType?: "all" | "author" | "title" | "publisher";
  sort_by?:
    | "newest"
    | "oldest"
    | "newest_added"
    | "oldest_added"
    | "title_asc"
    | "title_desc"
    | "popular";
  limit?: number;
}) {
  const limit = params?.limit || 12;

  return useInfiniteQuery({
    queryKey: [
      ...bookKeys.infinite(),
      {
        filters: {
          keyword: params?.keyword,
          categoryId: params?.categoryId,
          status: params?.status,
          searchType: params?.searchType,
        },
        sort: params?.sort_by,
        limit, // Include limit in queryKey so it changes when limit changes
      },
    ],
    queryFn: async ({ pageParam }: { pageParam: number | string | null }) => {
      const offset = pageParam ? Number(pageParam) : 0;
      return await booksApi.getAllBooks({
        keyword: params?.keyword,
        category_id: params?.categoryId,
        status: params?.status,
        searchType: params?.searchType,
        sort_by: params?.sort_by,
        offset,
        limit,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const books = lastPage || [];

      // CRITICAL FIX: Only stop if we got ZERO books OR less than limit books
      // If we got exactly 'limit' books, there MIGHT be more pages
      if (!Array.isArray(books) || books.length === 0) {
        return null; // No more data
      }

      // Calculate next offset: total books fetched so far
      const totalBooksFetched = allPages.reduce(
        (total, page) => total + (Array.isArray(page) ? page.length : 0),
        0
      );

      // If we got fewer books than requested, we've reached the end
      if (books.length < limit) {
        return null; // Last page (partial page)
      }

      // If we got exactly 'limit' books, there might be more
      return totalBooksFetched;
    },
    initialPageParam: 0 as number,
    // Cache trong 3 phút (cân bằng freshness và performance)
    ...CACHE_TIMES.FAST,
    // Prevent duplicate requests in React Strict Mode
    maxPages: undefined,
  });
}

/**
 * Hook để fetch chi tiết sách
 */
export function useBook(bookId: number) {
  return useQuery({
    queryKey: bookKeys.detail(bookId),
    queryFn: () => booksApi.getBookById(bookId),
    enabled: !!bookId,
    // Cache chi tiết sách lâu hơn (detail page)
    ...CACHE_TIMES.SLOW,
  });
}

/**
 * Hook để fetch tổng số sách
 */
export function useBookCount() {
  return useQuery({
    queryKey: bookKeys.count(),
    queryFn: () => booksApi.getPublicBookCount(),
    // Cache count (ít thay đổi)
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook để prefetch sách - dùng khi hover vào book card
 */
export function usePrefetchBook() {
  const queryClient = useQueryClient();

  return (bookId: number) => {
    queryClient.prefetchQuery({
      queryKey: bookKeys.detail(bookId),
      queryFn: () => booksApi.getBookById(bookId),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * Hook để invalidate book cache - dùng sau khi thêm/sửa/xóa sách
 */
export function useInvalidateBooks() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: bookKeys.all });
  };
}
