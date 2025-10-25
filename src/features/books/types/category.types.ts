/**
 * Category entity types
 * Định nghĩa các interface cho Category entity từ API
 */

export interface Category {
  id: number;
  name: string;
  parent_id?: number | null;
  book_count?: number;
}

export interface CategoryInput {
  name: string;
  parent_id?: number | null;
}
