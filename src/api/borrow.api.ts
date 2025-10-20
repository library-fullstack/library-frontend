import axiosClient from "./axiosClient";

export interface BorrowRequest {
  book_id: string;
  borrow_date: string;
  expected_return_date: string;
}

export interface BorrowRecord {
  id: string;
  book_id: string;
  user_id: string;
  borrow_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  book?: {
    title: string;
    author: string;
    cover_image?: string;
  };
}

export const borrowApi = {
  create: (data: BorrowRequest) => axiosClient.post("/borrows", data),

  getMyBorrows: () => axiosClient.get<BorrowRecord[]>("/borrows/my"),

  returnBook: (id: string) => axiosClient.patch(`/borrows/${id}/return`),

  renewBook: (id: string) => axiosClient.patch(`/borrows/${id}/renew`),
};
