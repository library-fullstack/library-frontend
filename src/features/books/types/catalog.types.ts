import type { BookStatus, BookFormat } from ".";

export interface BookFilters {
  keyword?: string;
  category_id?: number | null;
  status?: BookStatus;
  format?: BookFormat | null;
  language_code?: string | null;
  searchType?: "all" | "author" | "title" | "publisher";
}

export type SortOption =
  | "newest-published"
  | "oldest-published"
  | "newest-added"
  | "oldest-added"
  | "title-asc"
  | "title-desc"
  | "popular";

export interface CatalogState {
  filters: BookFilters;
  sortBy: SortOption;
  page: number;
  limit: number;
}

export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];
export const DEFAULT_ITEMS_PER_PAGE = 24;

export const SORT_OPTIONS = [
  { value: "newest-published", label: "Năm xuất bản: Mới nhất" },
  { value: "oldest-published", label: "Năm xuất bản: Cũ nhất" },
  { value: "newest-added", label: "Ngày nhập sách: Mới nhất" },
  { value: "oldest-added", label: "Ngày nhập sách: Cũ nhất" },
  { value: "title-asc", label: "Tên sách: A-Z" },
  { value: "title-desc", label: "Tên sách: Z-A" },
  { value: "popular", label: "Phổ biến nhất" },
] as const;

export const FORMAT_OPTIONS = [
  { value: "PAPERBACK", label: "Bìa mềm" },
  { value: "HARDCOVER", label: "Bìa cứng" },
  { value: "OTHER", label: "Khác" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "Tiếng Anh" },
  { value: "fr", label: "Tiếng Pháp" },
  { value: "ja", label: "Tiếng Nhật" },
  { value: "ko", label: "Tiếng Hàn" },
  { value: "zh", label: "Tiếng Trung" },
] as const;
