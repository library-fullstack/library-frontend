import axiosClient from "../../../shared/api/axiosClient";
import type { Publisher, PublisherInput } from "../types";

// gọi lấy hết tên nhà xuất bản
const getAllPublishers = async () => {
  const res = await axiosClient.get<Publisher[]>("/publishers");
  return res.data;
};

// gọi api tạo nhà xuất bản mới
const createPublisher = async (data: PublisherInput) => {
  const res = await axiosClient.post<{ message: string }>("/publishers", data);
  return res.data;
};

// gọi api cập nhật nhà xuất bản
const updatePublisher = async (id: number, data: PublisherInput) => {
  const res = await axiosClient.put<{ message: string }>(
    `/publishers/${id}`,
    data
  );
  return res.data;
};

// gọi api xoá nhà xuất bản
const deletePublisher = async (id: number) => {
  const res = await axiosClient.delete<{ message: string }>(
    `/publishers/${id}`
  );
  return res.data;
};

// xuất hết
export { getAllPublishers, createPublisher, updatePublisher, deletePublisher };
