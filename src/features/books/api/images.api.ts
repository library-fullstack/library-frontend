import axiosClient from "../../../shared/api/axiosClient";

// khai báo thành phần BookImage
export interface BookImage {
  id: number;
  book_id: number;
  url: string;
  kind?: "COVER" | "GALLERY";
  sort_order?: number;
  alt_text?: string | null;
}

// gọi api lấy tất cả ảnh của sách
const getImagesByBook = async (book_id: number) => {
  const res = await axiosClient.get<BookImage[]>(`/images/${book_id}`);
  return res.data;
};

// gọi api thêm ảnh cho sách
const addBookImage = async (data: {
  book_id: number;
  url: string;
  kind?: "COVER" | "GALLERY";
  sort_order?: number;
  alt_text?: string | null;
}) => {
  const res = await axiosClient.post<{ message: string }>("/images", data);
  return res.data;
};

// gọi api xoá ảnh của sách
const deleteBookImage = async (image_id: number) => {
  const res = await axiosClient.delete<{ message: string }>(
    `/images/${image_id}`
  );
  return res.data;
};

// xuất tất cả
export { getImagesByBook, addBookImage, deleteBookImage };
