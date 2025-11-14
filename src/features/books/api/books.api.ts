import axiosClient from "../../../shared/api/axiosClient";
import type { Book, BookInputFull } from "../types";

const getAllBooks = async (params?: {
  keyword?: string;
  category_id?: number;
  status?: string;
  limit?: number;
  offset?: number;
  cursor?: number | string | null;
  searchType?: "all" | "author" | "title" | "publisher";
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
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== null && value !== undefined
    )
  );

  if (typeof window !== "undefined" && cleanParams.limit) {
    console.log(
      `[Books API] Fetching books with limit=${cleanParams.limit}, offset=${
        cleanParams.offset || 0
      }`
    );
  }

  const res = await axiosClient.get<Book[]>("/books", {
    params: cleanParams,
    headers: { "Cache-Control": "no-cache" },
  });

  if (typeof window !== "undefined") {
    console.log(
      `[Books API] Received ${res.data?.length || 0} books (limit was ${
        cleanParams.limit
      })`
    );
  }

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

// timf sách theo danh mục
const getBooksByCategory = async (
  category_id: number,
  limit = 10,
  offset = 0
) => {
  return getAllBooks({ category_id, limit, offset });
};

// tìm sách theo từ khoá
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
