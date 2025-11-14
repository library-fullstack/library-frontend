export interface ApiErrorResponse {
  message?: string;
  success?: boolean;
  code?: string;
  errors?:
    | Record<string, string | string[]>
    | Array<{
        book_id: number;
        book_title: string;
        requested: number;
        available: number;
        message: string;
      }>;
}

export interface ApiError {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
  message?: string;
}

export interface HttpError extends Error {
  status?: number;
  code?: string;
}
