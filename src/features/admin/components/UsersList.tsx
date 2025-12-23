import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  fullname: string;
  student_id?: string;
  phone?: string;
  role: "USER" | "ADMIN" | "LIBRARIAN" | "MODERATOR";
  is_active: boolean;
  created_at: string;
}

interface UsersListProps {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const getRoleInfo = (role: string) => {
  switch (role) {
    case "ADMIN":
      return { label: "Quản trị viên", color: "error" as const };
    case "LIBRARIAN":
      return { label: "Thủ thư", color: "primary" as const };
    case "MODERATOR":
      return { label: "Kiểm duyệt viên", color: "secondary" as const };
    default:
      console.log("[UsersList] Role not matched, falling back to default");
      return { label: "Người dùng", color: "default" as const };
  }
};

export default function UsersList({
  users,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: UsersListProps): React.ReactElement {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mã SV</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">
                    Không có người dùng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {user.fullname.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{user.fullname}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.student_id || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={roleInfo.label}
                        size="small"
                        color={roleInfo.color}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.is_active ? "Hoạt động" : "Vô hiệu"}
                        size="small"
                        color={user.is_active ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" onClick={() => onEdit(user)}>
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Xác nhận xóa người dùng "${user.fullname}"?`
                              )
                            ) {
                              onDelete(user.id);
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={onPageChange}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />
    </Box>
  );
}
