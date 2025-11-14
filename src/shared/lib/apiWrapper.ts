import logger from "./logger";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
  details?: unknown;
}

export enum ErrorMode {
  THROW = "throw",
  RETURN_NULL = "return_null",
  SILENT = "silent",
}

export async function apiWrapper<T>(
  fn: () => Promise<T>,
  context: string = "[API]",
  mode: ErrorMode = ErrorMode.THROW
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    switch (mode) {
      case ErrorMode.THROW:
        logger.error(`${context} Error:`, error);
        throw error;

      case ErrorMode.RETURN_NULL:
        logger.warn(`${context} Error (returning null):`, errorMsg);
        return null;

      case ErrorMode.SILENT:
        return null;

      default:
        logger.error(`${context} Error:`, error);
        throw error;
    }
  }
}

export async function apiCall<T, R = T>(
  fn: () => Promise<{ data: T }>,
  transform?: (data: T) => R,
  context: string = "[API]",
  mode: ErrorMode = ErrorMode.THROW
): Promise<R | null> {
  return apiWrapper(
    async () => {
      const response = await fn();
      return transform
        ? transform(response.data)
        : (response.data as unknown as R);
    },
    context,
    mode
  );
}

export const responseValidators = {
  isArray: <T>(data: unknown): data is T[] => Array.isArray(data),
  isObject: <T extends object>(data: unknown): data is T =>
    typeof data === "object" && data !== null,
  hasData: <T>(data: unknown): data is { data: T } =>
    typeof data === "object" && data !== null && "data" in data,
};

export function createApiError(
  error: unknown,
  defaultMessage: string = "Unknown error"
): ApiErrorResponse {
  const errorObject = error as Record<string, unknown>;
  const statusCode = (errorObject?.response as Record<string, unknown>)?.status;
  const responseData = (errorObject?.response as Record<string, unknown>)?.data;
  const message =
    (responseData as Record<string, unknown>)?.message ||
    (error as Error)?.message ||
    defaultMessage;

  return {
    success: false,
    error: String(message),
    statusCode: statusCode as number | undefined,
    details: responseData,
  };
}
