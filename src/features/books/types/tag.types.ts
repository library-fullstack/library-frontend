export interface Tag {
  id: number;
  name: string;
  book_count?: number;
}

export interface TagInput {
  name: string;
}

export interface TagAttachment {
  book_id: number;
  tag_id: number;
}
