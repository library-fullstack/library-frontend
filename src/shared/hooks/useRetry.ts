import { useCallback } from "react";

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export function useRetry() {
  return useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: RetryOptions = {}
    ): Promise<T> => {
      const {
        maxAttempts = 3,
        delayMs = 1000,
        backoffMultiplier = 2,
        onRetry,
      } = options;

      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (attempt < maxAttempts) {
            const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);

            onRetry?.(attempt, lastError);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    },
    []
  );
}
