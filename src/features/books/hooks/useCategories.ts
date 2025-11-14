import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/books/api";
import { CACHE_TIMES } from "@/shared/lib/cacheTimes";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesApi.getAllCategories(),
    ...CACHE_TIMES.VERY_SLOW,
  });
}
