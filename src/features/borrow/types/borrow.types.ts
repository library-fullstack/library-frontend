export interface CartItem {
  bookId: number;
  quantity: number;
  title: string;
  thumbnail_url?: string | null;
  author_names?: string | null;
  available_count?: number | null;
  copies_count?: number | null;
}

export interface BorrowCart {
  items: CartItem[];
  totalBooks: number;
  totalCopies: number;
}

export interface CreateBorrowRequest {
  items: Array<{
    book_id: number;
    quantity: number;
  }>;
}

export interface CreateBorrowResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    user_id: string;
    items: Array<{
      id: string;
      book_id: number;
      quantity: number;
      status: string;
    }>;
    status: string;
    created_at: string;
  };
}
