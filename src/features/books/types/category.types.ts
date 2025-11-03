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
