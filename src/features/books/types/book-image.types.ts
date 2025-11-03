export interface BookImage {
  id: number;
  book_id: number;
  url: string;
  kind: "COVER" | "GALLERY";
  sort_order: number;
  alt_text?: string | null;
  created_at?: string;
}

export interface BookImageInput {
  book_id: number;
  url: string;
  kind?: "COVER" | "GALLERY";
  sort_order?: number;
  alt_text?: string | null;
}
