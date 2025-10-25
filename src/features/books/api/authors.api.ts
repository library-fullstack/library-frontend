import axiosClient from "../../../shared/api/axiosClient";
import type { Author, AuthorInput } from "../types";

// gọi api lấy tác giả của sách
const getAuthorsByBook = async (book_id: number) => {
  const res = await axiosClient.get<Author[]>(`/authors/${book_id}`);
  return res.data;
};

// gọi api thêm tác giả cho sách
const addAuthorToBook = async (book_id: number, data: AuthorInput) => {
  const res = await axiosClient.post<{ message: string }>(
    `/authors/${book_id}`,
    data
  );
  return res.data;
};

// gọi api xoá tác giải khỏi sách
const removeAuthorFromBook = async (book_id: number, author_id: number) => {
  const res = await axiosClient.delete<{ message: string }>(
    `/authors/${book_id}/${author_id}`
  );
  return res.data;
};

// xuất hết
export { getAuthorsByBook, addAuthorToBook, removeAuthorFromBook };
