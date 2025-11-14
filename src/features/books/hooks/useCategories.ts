import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/books/api";
import { CACHE_TIMES } from "@/shared/lib/cacheTimes";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

/**
 * Hook để fetch danh sách categories với caching
 * Cache 15 phút vì categories ít thay đổi
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesApi.getAllCategories(),
    // Categories rarely change - use VERY_SLOW tier
    ...CACHE_TIMES.VERY_SLOW,
  });
}
