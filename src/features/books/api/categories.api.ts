import axiosClient from "../../../shared/api/axiosClient";
import type { Category, CategoryInput } from "../types";

// gọi api lấy tất cả loại sách
const getAllCategories = async () => {
  const res = await axiosClient.get<Category[]>("/categories");
  return res.data;
};

// gọi api tạo loại sách cho sách
const createCategory = async (data: CategoryInput) => {
  const res = await axiosClient.post<{ message: string }>("/categories", data);
  return res.data;
};

// gọi api cập nhật loại sách cho sách
const updateCategory = async (id: number, data: CategoryInput) => {
  const res = await axiosClient.put<{ message: string }>(
    `/categories/${id}`,
    data
  );
  return res.data;
};

// gọi api xoá loại sách của sách
const deleteCategory = async (id: number) => {
  const res = await axiosClient.delete<{ message: string }>(
    `/categories/${id}`
  );
  return res.data;
};

// xuất hết
export { getAllCategories, createCategory, updateCategory, deleteCategory };
