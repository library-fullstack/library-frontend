export interface ForumPost {
  id: number;
  title: string;
  author: string;
  avatar: string;
  category: string;
  content: string;
  views: number;
  replies: number;
  likes: number;
  timestamp: string;
  tags: string[];
}

export type ForumCategory =
  | "Tất cả"
  | "Công nghệ"
  | "Văn học"
  | "Lịch sử"
  | "Khoa học"
  | "Nghệ thuật"
  | "Trao đổi";
