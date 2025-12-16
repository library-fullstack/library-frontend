import axiosClient from "../../../shared/api/axiosClient";

export interface Favourite {
  id: number;
  user_id: string;
  book_id: number;
  title: string;
  author_names?: string | null;
  thumbnail_url?: string | null;
  description?: string | null;
  isbn?: string | null;
  publisher_name?: string | null;
  publication_date?: string | null;
  available_count?: number | null;
  created_at: string;
  updated_at: string;
}

export const favouritesApi = {
  getAll: () => axiosClient.get("/bookFavourite"),

  add: (bookId: number) => axiosClient.post("/bookFavourite/add", { bookId }),

  remove: (bookId: number) => {
    return axiosClient.request({
      method: "delete",
      url: "/bookFavourite/remove",
      data: { bookId },
    });
  },

  checkFavourite: (bookId: number) =>
    axiosClient.get(`/bookFavourite/check/${bookId}`),

  getCount: () => axiosClient.get("/bookFavourite/count"),
};
