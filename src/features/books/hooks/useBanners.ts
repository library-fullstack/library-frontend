import { useQuery } from "@tanstack/react-query";
import { bannerApi } from "../../admin/api/banner.api";
import { CACHE_TIMES } from "@/shared/lib/cacheTimes";

export const bannerKeys = {
  all: ["banners"] as const,
  active: () => [...bannerKeys.all, "active"] as const,
};

export function useActiveBanner() {
  return useQuery({
    queryKey: bannerKeys.active(),
    queryFn: () => bannerApi.getActiveBanner(),
    ...CACHE_TIMES.FAST,
  });
}
