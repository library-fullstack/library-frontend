export interface Publisher {
  id: number;
  name: string;
  city?: string | null;
  country?: string | null;
  book_count?: number;
}

export interface PublisherInput {
  name: string;
  city?: string | null;
  country?: string | null;
}
