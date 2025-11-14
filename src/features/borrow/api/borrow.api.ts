import axiosClient from "../../../shared/api/axiosClient";
import type {
  CreateBorrowRequest,
  CreateBorrowResponse,
} from "../types/borrow.types";

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
  createBorrow: async (data: CreateBorrowRequest) => {
    const res = await axiosClient.post<CreateBorrowResponse>("/borrows", {
      items: data.items.map((item) => ({
        book_id: item.book_id,
        quantity: item.quantity,
      })),
    });
    return res.data;
  },

  create: (data: BorrowRequest) => axiosClient.post("/borrows", data),

  getMyBorrows: () => axiosClient.get<BorrowRecord[]>("/borrows/my"),

  returnBook: (id: string) => axiosClient.patch(`/borrows/${id}/return`),

  renewBook: (id: string) => axiosClient.patch(`/borrows/${id}/renew`),

  getCart: () => axiosClient.get("/cart"),

  addToCart: (bookId: number, quantity: number) =>
    axiosClient.post("/cart/add", { bookId, quantity }),

  updateCartQuantity: (bookId: number, quantity: number) =>
    axiosClient.patch("/cart/update", { bookId, quantity }),

  removeFromCart: (bookId: number) =>
    axiosClient.request({
      method: "DELETE",
      url: "/cart/remove",
      data: { bookId },
    }),

  clearCart: () =>
    axiosClient.request({
      method: "DELETE",
      url: "/cart/clear",
    }),

  getCartSummary: () => axiosClient.get("/cart/summary"),
};
