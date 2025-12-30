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
    borrowId: number;
    ticketNumber: string;
    status: string;
    dueDate: string;
    reservedCopies: Array<{
      copy_id: number;
      book_title: string;
    }>;
    note: string;
  };
}

export type ReturnReason =
  | "GOOD_CONDITION"
  | "DAMAGED"
  | "LOST"
  | "WORN"
  | "WATER_DAMAGED"
  | "WRITTEN_ON"
  | "STAINED"
  | "DETERIORATED"
  | "OTHER";

export type BorrowStatus =
  | "PENDING"
  | "CONFIRMED"
  | "APPROVED"
  | "ACTIVE"
  | "OVERDUE"
  | "RETURNED"
  | "CANCELLED";

export interface BorrowData {
  id: number;
  user_id: string;
  fullname: string;
  email: string;
  student_id?: string;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: BorrowStatus;
  signature?: string;
  items?: Array<{
    copy_id: number;
    book_id: number;
    book_title: string;
    thumbnail_url?: string;
  }>;
}
