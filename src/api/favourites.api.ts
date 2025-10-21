import axiosClient from "./axiosClient";

export interface Favourite {
  id: string;
  book_id: string;
  user_id: string;
  created_at: string;
  book?: {
    id: string;
    title: string;
    author: string;
    cover_image?: string;
  };
}

// api cho phần yêu thích - chưa làm gì cả
export const favouritesApi = {
  getAll: () => axiosClient.get<Favourite[]>("/favourites"),

  add: (book_id: string) => axiosClient.post("/favourites", { book_id }),

  remove: (id: string) => axiosClient.delete(`/favourites/${id}`),

  checkFavourite: (book_id: string) =>
    axiosClient.get<{ is_favourite: boolean }>(`/favourites/check/${book_id}`),
};
