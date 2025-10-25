import axiosClient from "../../../shared/api/axiosClient";
import type { Book, BookInputFull } from "../types";

// export interface PaginatedResponse<T> {
//   data: T[];
//   total?: number;
//   page?: number;
//   limit?: number;
// }

// gọi api lấy tất cả danh sách sách, có phân trang và tìm kiếm
const getAllBooks = async (params?: {
  keyword?: string;
  category_id?: number;
  status?: string;
  limit?: number;
  offset?: number;
  sort_by?:
    | "newest"
    | "oldest"
    | "newest_added"
    | "oldest_added"
    | "title_asc"
    | "title_desc"
    | "popular";
  order?: "asc" | "desc";
}) => {
  const res = await axiosClient.get<Book[]>("/books", {
    params,
    headers: { "Cache-Control": "no-cache" },
  });
  return res.data;
};

// gọi api lấy chi tiết 1 quyển sách
// khi bấm vào quyển sách sẽ đi đến chi tiết của quyển đó
const getBookById = async (book_id: number) => {
  const res = await axiosClient.get<Book>(`/books/${book_id}`);
  return res.data;
};

// gọi api kiểm tra xem sách có còn không ( còn khả dụng không ) để hỗ trợ mượn
const checkBookAvailable = async (book_id: number) => {
  const res = await axiosClient.get<{ bookId: number; available: boolean }>(
    `/books/${book_id}/available`
  );
  return res.data;
};

// Tìm sách theo danh mục
const getBooksByCategory = async (
  category_id: number,
  limit = 10,
  offset = 0
) => {
  return getAllBooks({ category_id, limit, offset });
};

// Tìm sách theo từ khoá
const getBooksByKeyword = async (keyword: string, limit = 10, offset = 0) => {
  return getAllBooks({ keyword, limit, offset });
};

// gọi api thêm mới sách
const createBook = async (data: BookInputFull) => {
  const res = await axiosClient.post<{ message: string }>("/books", data);
  return res.data;
};

// gọi api cập nhật toàn bộ thông tin của sách
const updateBookById = async (book_id: number, data: BookInputFull) => {
  const res = await axiosClient.put<{ message: string }>(
    `/books/${book_id}`,
    data
  );
  return res.data;
};

// gọi api xoá sách. chỉ admin hoặc librarian
const deleteBookById = async (book_id: number) => {
  const res = await axiosClient.delete<{ message: string }>(
    `/books/${book_id}`
  );
  return res.data;
};

// gọi api cập nhật trạng thái sách (ACTIVE / INACTIVE / DRAFT)
// hỗ trợ admin, libarian huỷ sách tạm thời
const updateBookStatus = async (book_id: number, status: string) => {
  const res = await axiosClient.patch<{ message: string }>(
    `/books/${book_id}/status`,
    { status }
  );
  return res.data;
};

// gọi api lấy thông kê sách cho admin
const getBookStats = async () => {
  try {
    const res = await axiosClient.get<{
      total: number;
      active: number;
      inactive: number;
      draft: number;
    }>("/books/stats/overview");
    return res.data;
  } catch (error) {
    // thay vì trả về lỗi ngay thì trả về tất cả đều 0
    // bây giờ thì không cần. lười xoá thôi cứ để tạm
    const err = error as unknown as { response?: { status?: number } };
    if (err?.response?.status === 401) {
      return { total: 0, active: 0, inactive: 0, draft: 0 };
    }
    throw error;
  }
};

// gọi api lấy tổng số sách để hỗ trợ trang catalog
const getPublicBookCount = async () => {
  const res = await axiosClient.get<{ total: number }>("/books/count");
  return res.data;
};

// xuất tất cả
export {
  getAllBooks,
  getBookById,
  getBooksByCategory,
  getBooksByKeyword,
  checkBookAvailable,
  createBook,
  updateBookById,
  deleteBookById,
  updateBookStatus,
  getBookStats,
  getPublicBookCount,
};
