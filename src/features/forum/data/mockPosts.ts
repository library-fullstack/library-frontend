import { ForumPost, ForumCategory } from "../types/forum.types";

// giả lập post - chưa làm gì cả
export const mockPosts: ForumPost[] = [
  {
    id: 1,
    category_id: 1,
    title: "Những cuốn sách hay nên đọc về lập trình",
    slug: "nhung-cuon-sach-hay-nen-doc-ve-lap-trinh",
    content:
      "Xin chào mọi người, mình muốn các bro cho nhận xét về cuốn sách của tác giả Lê Văn Huy...",
    status: "APPROVED",
    pinned: false,
    views_count: 3636,
    comments_count: 36,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    category_id: 3,
    title: "Review sách 'Lịch sử loài chó: Lê Văn Huy'",
    slug: "review-sach-lich-su-loai-cho",
    content:
      "Vừa đọc xong cuốn này và thực sự rất ấn tượng. Tác giả Nguyễn Thị Quỳnh viết bẩn không tả được...",
    status: "APPROVED",
    pinned: false,
    views_count: 360,
    comments_count: 67,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    category_id: 7,
    title: "Trao đổi sách cũ khu vực Hà Nội",
    slug: "trao-doi-sach-cu-khu-vuc-ha-noi",
    content:
      "Mình có một số sách cũ còn mới muốn trao đổi với các bạn cùng sở thích đọc sách...",
    status: "APPROVED",
    pinned: false,
    views_count: 567,
    comments_count: 23,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const forumCategories: ForumCategory[] = [
  {
    id: 0,
    name: "Tất cả",
    slug: "tat-ca",
    sort_order: 0,
    is_locked: false,
  },
  {
    id: 1,
    name: "Công nghệ",
    slug: "cong-nghe",
    sort_order: 1,
    is_locked: false,
  },
  {
    id: 2,
    name: "Văn học",
    slug: "van-hoc",
    sort_order: 2,
    is_locked: false,
  },
  {
    id: 3,
    name: "Lịch sử",
    slug: "lich-su",
    sort_order: 3,
    is_locked: false,
  },
  {
    id: 4,
    name: "Khoa học",
    slug: "khoa-hoc",
    sort_order: 4,
    is_locked: false,
  },
  {
    id: 5,
    name: "Nghệ thuật",
    slug: "nghe-thuat",
    sort_order: 5,
    is_locked: false,
  },
  {
    id: 6,
    name: "Trao đổi",
    slug: "trao-doi",
    sort_order: 6,
    is_locked: false,
  },
];
