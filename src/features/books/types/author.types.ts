/**
 * Author entity types
 * Định nghĩa các interface cho Author entity từ API
 */

export interface Author {
  id: number;
  name: string;
  role?: string;
  ord?: number | null;
}

export interface AuthorInput {
  author_id: number;
  role?: string;
  ord?: number;
}
