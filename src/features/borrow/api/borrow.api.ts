import axiosClient from "../../../shared/api/axiosClient";
import type {
  CreateBorrowRequest,
  CreateBorrowResponse,
} from "../types/borrow.types";
import { BorrowStatus, ReturnReason } from "../types/borrow.types";

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
  status: BorrowStatus;
  book?: {
    title: string;
    author: string;
    cover_image?: string;
  };
}

export interface BorrowPreviewData {
  id: number;
  user_id: string;
  borrow_date: string;
  due_date: string;
  status: string;
  fullname: string;
  email: string;
  student_id?: string;
  return_reasons?: ReturnReason[];
  items?: Array<{
    copy_id: number;
    book_id: number;
    book_title: string;
    thumbnail_url?: string;
    isbn?: string;
    barcode?: string;
  }>;
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

  getBorrowPreview: async (borrowId: number) => {
    const res = await axiosClient.get<{
      success: boolean;
      data: BorrowPreviewData;
    }>(`/borrows/${borrowId}/preview`);
    return res.data;
  },

  confirmBorrow: async (borrowId: number, signature: string) => {
    const res = await axiosClient.post<{ success: boolean; message: string }>(
      `/borrows/${borrowId}/confirm`,
      { signature }
    );
    return res.data;
  },

  create: (data: BorrowRequest) => axiosClient.post("/borrows", data),

  getMyBorrows: () => axiosClient.get<BorrowRecord[]>("/borrows/my"),

  returnBorrow: (id: number, reasons: ReturnReason[]) =>
    axiosClient.post(`/borrows/${id}/return`, { returnReasons: reasons }),

  renewBook: (id: string) => axiosClient.patch(`/borrows/${id}/renew`),

  renewBorrow: async (borrowId: number) => {
    const res = await axiosClient.post(`/borrows/${borrowId}/renew`);
    return res.data;
  },

  cancelBorrow: async (borrowId: number) => {
    const res = await axiosClient.patch(`/borrows/admin/${borrowId}/status`, {
      status: "CANCELLED",
    });
    return res.data;
  },

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
