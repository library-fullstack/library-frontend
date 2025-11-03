export type CopyCondition = "NEW" | "GOOD" | "WORN" | "DAMAGED" | "LOST";
export type CopyStatus = "AVAILABLE" | "ON_LOAN" | "RESERVED" | "LOST" | "REMOVED";

export interface BookCopy {
  id: number;
  book_id: number;
  barcode: string;
  shelf_code?: string | null;
  acquisition_date?: string | null;
  condition_enum: CopyCondition;
  status: CopyStatus;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BookCopyInput {
  book_id: number;
  barcode: string;
  shelf_code?: string | null;
  acquisition_date?: string | null;
  condition_enum?: CopyCondition;
  status?: CopyStatus;
  note?: string | null;
}
