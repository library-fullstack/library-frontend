export const CACHE_TIMES = {
  FAST: {
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  NORMAL: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  },

  SLOW: {
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  },

  VERY_SLOW: {
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  },

  STATIC: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  },
};

export const REFETCH_STRATEGY = {
  STANDARD: {
    refetchOnWindowFocus: "always" as const,
    refetchOnMount: "always" as const,
    refetchOnReconnect: "always" as const,
  },

  AGGRESSIVE: {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },

  CONSERVATIVE: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
};

export const RETRY_STRATEGY = {
  queries: {
    retry: 1,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    retry: 1,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },
};
