import axiosClient from "../../../shared/api/axiosClient";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image?: string;
  isbn?: string;
  published_year?: number;
  category?: string;
  available_copies: number;
  total_copies: number;
  thumbnail_url?: string;
}

export interface BooksListResponse {
  data: Book[];
  total: number;
  page: number;
  limit: number;
}

const getAllBooks = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await axiosClient.get<Book[]>("/books", {
    params,
    headers: { "Cache-Control": "no-cache" },
  });
  return res;
};

// get book by id
const getBookById = (id: string) => {
  return axiosClient.get<Book>(`/books/${id}`);
};

// get hết book
const searchBook = (query: string) => {
  return axiosClient.get<BooksListResponse>("/books/search", {
    params: { q: query },
  });
};

// get book theo danh mục
const getBookByCategory = (category: string) => {
  return axiosClient.get<BooksListResponse>(`/books/category/${category}`);
};

export { getAllBooks, getBookById, searchBook, getBookByCategory };
