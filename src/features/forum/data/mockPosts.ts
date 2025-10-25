import { ForumPost, ForumCategory } from "../types/forum.types";

// giả lập post - chưa làm gì cả
export const mockPosts: ForumPost[] = [
  {
    id: 1,
    title: "Những cuốn sách hay nên đọc về lập trình",
    author: "Phạm Ngọc Bảo",
    avatar:
      "https://gdtd.1cdn.vn/thumbs/540x360/2023/01/30/cdn.24h.com.vn-upload-1-2023-images-2023-01-30-_1675045134-506-thumbnail-width740height555-auto-crop.jpg",
    category: "Công nghệ",
    content:
      "Xin chào mọi người, mình muốn các bro cho nhận xét về cuốn sách của tác giả Lê Văn Huy...",
    views: 3636,
    replies: 36,
    likes: 36,
    timestamp: "2 giờ trước",
    tags: ["Lập trình", "Sách hay"],
  },
  {
    id: 2,
    title: "Review sách 'Lịch sử loài chó: Lê Văn Huy'",
    author: "Tạ Hữu Anh Bình",
    avatar:
      "https://cdn.tgdd.vn/2022/09/CookDish/rau-ma-co-may-loai-4-mon-ngon-lam-tu-rau-ma-avt-1200x676.jpg",
    category: "Lịch sử",
    content:
      "Vừa đọc xong cuốn này và thực sự rất ấn tượng. Tác giả Nguyễn Thị Quỳnh viết bẩn không tả được...",
    views: 360,
    replies: 67,
    likes: 134,
    timestamp: "5 giờ trước",
    tags: ["Lịch sử", "Nhân loại", "Khoa học"],
  },
  {
    id: 3,
    title: "Trao đổi sách cũ khu vực Hà Nội",
    author: "Lê Văn Huy",
    avatar:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg",
    category: "Trao đổi",
    content:
      "Mình có một số sách cũ còn mới muốn trao đổi với các bạn cùng sở thích đọc sách...",
    views: 567,
    replies: 23,
    likes: 45,
    timestamp: "1 ngày trước",
    tags: ["Trao đổi", "Hà Nội"],
  },
];

export const forumCategories: ForumCategory[] = [
  "Tất cả",
  "Công nghệ",
  "Văn học",
  "Lịch sử",
  "Khoa học",
  "Nghệ thuật",
  "Trao đổi",
];
