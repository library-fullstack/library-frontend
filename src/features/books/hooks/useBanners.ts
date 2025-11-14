import { useQuery } from "@tanstack/react-query";
import { bannerApi } from "../../admin/api/banner.api";
import { CACHE_TIMES } from "@/shared/lib/cacheTimes";

// Query keys
export const bannerKeys = {
  all: ["banners"] as const,
  active: () => [...bannerKeys.all, "active"] as const,
};

/**
 * Hook để fetch active banner với caching
 * Cache 5 phút
 */
export function useActiveBanner() {
  return useQuery({
    queryKey: bannerKeys.active(),
    queryFn: () => bannerApi.getActiveBanner(),
    // Banner can change frequently - use FAST tier
    ...CACHE_TIMES.FAST,
  });
}
