import axiosClient from "../../../shared/api/axiosClient";

export const uploadApi = {
  async uploadImage(
    file: File,
    folder: "banners" | "events" | "news" = "banners"
  ): Promise<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const response = await axiosClient.post<{
      success: boolean;
      data: { url: string; public_id: string };
    }>(`/admin/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};
