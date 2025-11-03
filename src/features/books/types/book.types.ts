/**
 * Book entity types
 * Định nghĩa các interface cho Book entity từ API
 */

import type { Author } from "./author.types";
import type { BookImage } from "./book-image.types";
import type { BookCopy } from "./book-copy.types";

export interface Book {
  id: number;
  title: string;
  category_id?: number | null;
  publisher_id?: number | null;
  publication_year?: number | null;
  isbn13?: string | null;
  call_number?: string | null;
  language_code?: string | null;
  format?: "PAPERBACK" | "HARDCOVER" | "OTHER" | null;
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
  description?: string | null;
  thumbnail_url?: string | null;

  // Relations (từ API)
  author_names?: string | null;
  category_name?: string | null;
  publisher_name?: string | null;
  publisher_city?: string | null;
  publisher_country?: string | null;
  tags?: string[] | null;
  copies_count?: number | null;
  available_count?: number | null;

  // Extended relations
  authors?: Author[];
  images?: BookImage[];
  copies?: BookCopy[];

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface BookInput {
  title: string;
  category_id?: number | null;
  publisher_id?: number | null;
  publication_year?: number | null;
  isbn13?: string | null;
  call_number?: string | null;
  language_code?: string | null;
  format?: "PAPERBACK" | "HARDCOVER" | "OTHER" | null;
  description?: string | null;
  thumbnail_url?: string | null;
}

export interface BookInputFull extends BookInput {
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
}

export type BookFormat = "PAPERBACK" | "HARDCOVER" | "OTHER";
export type BookStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

/**
 * Extended book detail with additional information
 * Used for book detail page
 */
export interface BookDetail extends Book {
  // Metadata có thể cần thêm từ API nếu có
  author_count?: number;
}
