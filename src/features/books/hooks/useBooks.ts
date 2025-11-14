import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { booksApi } from "@/features/books/api";
import type { BookFilters, SortOption } from "@/features/books/types";
import { CACHE_TIMES } from "@/shared/lib/cacheTimes";

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
    ...CACHE_TIMES.NORMAL,
  });
}

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
        limit,
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

      if (!Array.isArray(books) || books.length === 0) {
        return null;
      }

      const totalBooksFetched = allPages.reduce(
        (total, page) => total + (Array.isArray(page) ? page.length : 0),
        0
      );

      if (books.length < limit) {
        return null;
      }

      return totalBooksFetched;
    },
    initialPageParam: 0 as number,
    ...CACHE_TIMES.FAST,
    maxPages: undefined,
  });
}

export function useBook(bookId: number) {
  return useQuery({
    queryKey: bookKeys.detail(bookId),
    queryFn: () => booksApi.getBookById(bookId),
    enabled: !!bookId,
    ...CACHE_TIMES.SLOW,
  });
}

export function useBookCount() {
  return useQuery({
    queryKey: bookKeys.count(),
    queryFn: () => booksApi.getPublicBookCount(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

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

export function useInvalidateBooks() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: bookKeys.all });
  };
}
