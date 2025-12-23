import axiosClient from "../../../shared/api/axiosClient";

export interface DashboardStatistics {
  totalBooks: number;
  activeBooks: number;
  totalUsers: number;
  totalBorrows: number;
  activeBorrows: number;
  overdueBorrows: number;
  totalCategories: number;
  totalPublishers: number;
  booksAddedThisMonth: number;
  usersJoinedThisMonth: number;
  borrowsThisMonth: number;
  booksAddedLastMonth: number;
  usersJoinedLastMonth: number;
  borrowsLastMonth: number;
  overdueLastMonth: number;
  growthRates: {
    books: number;
    users: number;
    borrows: number;
    overdue: number;
  };
  popularCategories: Array<{
    category_id: number;
    category_name: string;
    book_count: number;
  }>;
  recentBorrows: Array<{
    id: number;
    book_title: string;
    user_name: string;
    borrowed_at: string;
    due_date: string;
    status: string;
  }>;
  monthlyStats: Array<{
    month: string;
    books: number;
    users: number;
  }>;
  systemHealth: {
    databaseStatus: "healthy" | "warning" | "error";
    storageUsage: number;
    apiResponseTime: number;
  };
}

export interface UserManagementData {
  users: Array<{
    id: string;
    student_id: string;
    full_name: string;
    email: string;
    role: string;
    status: "ACTIVE" | "INACTIVE" | "BANNED";
    class_name: string | null;
    faculty: string | null;
    created_at: string;
  }>;
  total: number;
}

export interface BookManagementData {
  books: Array<{
    id: string | number;
    title: string;
    author_names: string;
    category_name: string;
    publisher_name: string;
    status: string;
    copies_count: number;
    available_count: number;
    created_at: string;
  }>;
  total: number;
}

export interface BorrowManagementData {
  borrows: Array<{
    id: string | number;
    book_id: string | number;
    book_title: string;
    user_id: string | number;
    user_name: string;
    student_id: string;
    borrowed_at: string;
    due_date: string;
    returned_at: string | null;
    status: string;
  }>;
  total: number;
}

export const statisticsApi = {
  getDashboardStats: () =>
    axiosClient.get<DashboardStatistics>("/statistics/dashboard"),

  getUserManagement: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => axiosClient.get<UserManagementData>("/statistics/users", { params }),

  getBookManagement: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => axiosClient.get<BookManagementData>("/statistics/books", { params }),

  getBorrowManagement: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    axiosClient.get<BorrowManagementData>("/statistics/borrows", { params }),

  updateUserStatus: (
    userId: string,
    status: "ACTIVE" | "INACTIVE" | "BANNED"
  ) => axiosClient.patch(`/admin/${userId}`, { status }),

  updateUserRole: (userId: string, role: string) =>
    axiosClient.patch(`/admin/${userId}`, { role }),

  deleteUser: (userId: string) => axiosClient.delete(`/admin/${userId}`),

  updateBorrowStatus: (borrowId: string | number, status: string) =>
    axiosClient.patch(`/statistics/borrows/${borrowId}`, { status }),
};
