import axiosClient from "../../../shared/api/axiosClient";
import type { Tag } from "../types";

// gọi api lấy hết nhãn của sách
const getAllTags = async () => {
  const res = await axiosClient.get<Tag[]>("/tags");
  return res.data;
};

// gọi api tạo nhãn mới cho sách
const createTag = async (name: string) => {
  const res = await axiosClient.post<{ message: string }>("/tags", { name });
  return res.data;
};

// gọi api gán nhãn vào cho sách
const attachTagToBook = async (book_id: number, tag_id: number) => {
  const res = await axiosClient.post<{ message: string }>("/tags/attach", {
    book_id,
    tag_id,
  });
  return res.data;
};

// gọi api xoá nhãn khỏi sách
const detachTagFromBook = async (book_id: number, tag_id: number) => {
  const res = await axiosClient.post<{ message: string }>("/tags/detach", {
    book_id,
    tag_id,
  });
  return res.data;
};

// xuất hết
export { getAllTags, createTag, attachTagToBook, detachTagFromBook };
