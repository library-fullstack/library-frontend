import { QueryClient } from "@tanstack/react-query";
import { CACHE_TIMES, REFETCH_STRATEGY, RETRY_STRATEGY } from "./cacheTimes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.NORMAL.staleTime,
      gcTime: CACHE_TIMES.NORMAL.gcTime,
      retry: RETRY_STRATEGY.queries.retry,
      retryDelay: RETRY_STRATEGY.queries.retryDelay,
      refetchOnWindowFocus: REFETCH_STRATEGY.STANDARD.refetchOnWindowFocus,
      refetchOnMount: REFETCH_STRATEGY.STANDARD.refetchOnMount,
      refetchOnReconnect: REFETCH_STRATEGY.STANDARD.refetchOnReconnect,
    },
    mutations: {
      retry: RETRY_STRATEGY.mutations.retry,
      retryDelay: RETRY_STRATEGY.mutations.retryDelay,
    },
  },
});

export { queryClient };
