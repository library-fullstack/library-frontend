import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../api";
import logger from "../../../shared/lib/logger";

const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...bookKeys.lists(), { ...filters }] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: number) => [...bookKeys.details(), id] as const,
};

/**
 * Hook for intelligent query prefetching
 * - Prefetch on hover
 * - Prefetch related books
 * - Prefetch list before route change
 */
export function useSmartPrefetch() {
  const queryClient = useQueryClient();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  /**
   * Prefetch book detail on hover
   * Debounced to avoid excessive requests
   */
  const prefetchBookOnHover = useCallback(
    (bookId: number, delayMs: number = 500) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        logger.info(`[Prefetch] Prefetching book ${bookId} on hover`);

        queryClient.prefetchQuery({
          queryKey: bookKeys.detail(bookId),
          queryFn: () => booksApi.getBookById(bookId),
          staleTime: 10 * 60 * 1000, // 10 minutes
        });
      }, delayMs);
    },
    [queryClient]
  );

  /**
   * Cancel hover prefetch
   */
  const cancelPrefetch = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  /**
   * Prefetch related books by category
   */
  const prefetchRelatedBooks = useCallback(
    async (categoryId: number, limit: number = 10) => {
      try {
        logger.info(
          `[Prefetch] Prefetching related books for category ${categoryId}`
        );

        queryClient.prefetchQuery({
          queryKey: bookKeys.list({ category_id: categoryId, limit }),
          queryFn: () =>
            booksApi.getAllBooks({
              category_id: categoryId,
              limit,
              sort_by: "newest",
            }),
          staleTime: 15 * 60 * 1000, // 15 minutes
        });
      } catch (err) {
        logger.error("[Prefetch] Failed to prefetch related books:", err);
      }
    },
    [queryClient]
  );

  /**
   * Prefetch books list before route change
   */
  const prefetchBooksList = useCallback(
    (filters?: Record<string, unknown>) => {
      try {
        logger.info("[Prefetch] Prefetching books list");

        queryClient.prefetchQuery({
          queryKey: bookKeys.list(filters || {}),
          queryFn: () =>
            booksApi.getAllBooks(
              filters as Parameters<typeof booksApi.getAllBooks>[0]
            ),
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
      } catch (err) {
        logger.error("[Prefetch] Failed to prefetch books list:", err);
      }
    },
    [queryClient]
  );

  /**
   * Prefetch author books
   */
  const prefetchAuthorBooks = useCallback(
    async (authorId: number, limit: number = 10) => {
      try {
        logger.info(`[Prefetch] Prefetching books by author ${authorId}`);

        queryClient.prefetchQuery({
          queryKey: ["books", "author", authorId],
          queryFn: () =>
            booksApi.getAllBooks({
              limit,
            }),
          staleTime: 15 * 60 * 1000,
        });
      } catch (err) {
        logger.error("[Prefetch] Failed to prefetch author books:", err);
      }
    },
    [queryClient]
  );

  /**
   * Prefetch multiple books (e.g., favorites, trending)
   */
  const prefetchMultipleBooks = useCallback(
    async (bookIds: number[]) => {
      logger.info(`[Prefetch] Prefetching ${bookIds.length} books`);

      const promises = bookIds.map((id) =>
        queryClient.prefetchQuery({
          queryKey: bookKeys.detail(id),
          queryFn: () => booksApi.getBookById(id),
          staleTime: 10 * 60 * 1000,
        })
      );

      try {
        await Promise.all(promises);
        logger.info(
          `[Prefetch] Successfully prefetched ${bookIds.length} books`
        );
      } catch (err) {
        logger.error("[Prefetch] Failed to prefetch multiple books:", err);
      }
    },
    [queryClient]
  );

  /**
   * Link prefetch - prefetch on link hover
   */
  const linkPrefetch = useCallback(
    (bookId: number, destination: string) => {
      prefetchBookOnHover(bookId, 300);

      return () => {
        setTimeout(() => {
          navigate(destination);
        }, 100);
      };
    },
    [prefetchBookOnHover, navigate]
  );

  return {
    prefetchBookOnHover,
    cancelPrefetch,
    prefetchRelatedBooks,
    prefetchBooksList,
    prefetchAuthorBooks,
    prefetchMultipleBooks,
    linkPrefetch,
  };
}

/**
 * Hook for route-based prefetching
 * Prefetch data needed for a route before navigating
 */
export function useRoutePrefetch() {
  const queryClient = useQueryClient();

  /**
   * Prefetch book catalog before navigating to /catalog
   */
  const prefetchCatalog = useCallback(async () => {
    logger.info("[Prefetch] Prefetching catalog data");

    try {
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["books", "list"],
        queryFn: async ({ pageParam }) =>
          booksApi.getAllBooks({
            limit: 20,
            offset: (pageParam as number) * 20,
          }),
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
      });
    } catch (err) {
      logger.error("[Prefetch] Failed to prefetch catalog:", err);
    }
  }, [queryClient]);

  /**
   * Prefetch user favorites before navigating to /favorites
   */
  const prefetchFavorites = useCallback(async () => {
    logger.info("[Prefetch] Prefetching favorites");

    try {
      // This would need a favorites API endpoint
      queryClient.prefetchQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
          // Return favorites list
          return [];
        },
        staleTime: 5 * 60 * 1000,
      });
    } catch (err) {
      logger.error("[Prefetch] Failed to prefetch favorites:", err);
    }
  }, [queryClient]);

  return {
    prefetchCatalog,
    prefetchFavorites,
  };
}

/**
 * Hook for viewport-based prefetching
 * Prefetch when items appear in viewport
 */
export function useViewportPrefetch() {
  const queryClient = useQueryClient();

  /**
   * Prefetch books when they enter viewport
   */
  const observeAndPrefetch = useCallback(
    (element: HTMLElement, bookIds: number[]) => {
      if (!("IntersectionObserver" in window)) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              logger.info("[Prefetch] Books entering viewport, prefetching...");

              bookIds.forEach((id) => {
                queryClient.prefetchQuery({
                  queryKey: ["books", "detail", id],
                  queryFn: () => booksApi.getBookById(id),
                  staleTime: 10 * 60 * 1000,
                });
              });
            }
          });
        },
        { rootMargin: "100px" }
      );

      observer.observe(element);

      return () => observer.disconnect();
    },
    [queryClient]
  );

  return { observeAndPrefetch };
}
