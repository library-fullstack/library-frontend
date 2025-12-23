import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Tabs,
  Tab,
  Snackbar,
} from "@mui/material";
import { Search, UserPlus } from "lucide-react";
import UsersList from "../../features/admin/components/UsersList";
import UserForm from "../../features/admin/components/UserForm";
import axiosClient from "../../shared/api/axiosClient";
import { parseApiError } from "../../shared/lib/errorHandler";

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

interface UserFormData {
  id?: string;
  email: string;
  fullname: string;
  student_id?: string;
  phone?: string;
  role: "USER" | "ADMIN" | "LIBRARIAN" | "MODERATOR";
  is_active: boolean;
  password?: string;
}

export default function UsersManagement(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
  });

  const roleTabs = [
    { label: "Tất cả", value: "" },
    { label: "Người dùng", value: "USER" },
    { label: "Thủ thư", value: "LIBRARIAN" },
    { label: "Kiểm duyệt viên", value: "MODERATOR" },
    { label: "Quản trị viên", value: "ADMIN" },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string | number> = {
        page: pagination.page + 1,
        limit: pagination.limit,
      };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const response = await axiosClient.get("/admin", { params });
      const data = response.data as {
        success: boolean;
        data: User[];
        pagination?: { total: number };
      };

      if (data.success) {
        setUsers(data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
        }));
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setRoleFilter(roleTabs[newValue].value);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleSubmit = async (formData: UserFormData) => {
    try {
      const backendData = {
        full_name: formData.fullname,
        email: formData.email,
        student_id: formData.student_id,
        phone: formData.phone,
        role: formData.role === "USER" ? "STUDENT" : formData.role,
        status: formData.is_active ? "ACTIVE" : "INACTIVE",
        password: editingUser ? undefined : formData.password || "Matkhau@123",
      };

      if (editingUser) {
        await axiosClient.put(`/admin/${editingUser.id}`, backendData);
        setSnackbar({
          open: true,
          message: "Cập nhật người dùng thành công!",
          severity: "success",
        });
      } else {
        await axiosClient.post("/admin", backendData);
        setSnackbar({
          open: true,
          message:
            "Thêm người dùng mới thành công! Mật khẩu mặc định: Matkhau@123",
          severity: "success",
        });
      }
      setFormOpen(false);
      setEditingUser(null);
      setPagination((prev) => ({ ...prev, page: 0 }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: parseApiError(err),
        severity: "error",
      });
      throw new Error(parseApiError(err));
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await axiosClient.delete(`/admin/${userToDelete}`);
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setPagination((prev) => ({ ...prev, page: 0 }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: parseApiError(err),
        severity: "error",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Quản lý người dùng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý tài khoản và phân quyền người dùng
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<UserPlus />}
            onClick={() => {
              setEditingUser(null);
              setFormOpen(true);
            }}
          >
            Thêm người dùng
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            px: 2,
          }}
        >
          {roleTabs.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} id={`user-tab-${index}`} />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tên, email, mã SV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 2, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UsersList
              users={users}
              pagination={pagination}
              onPageChange={(_, newPage) =>
                setPagination((prev) => ({ ...prev, page: newPage }))
              }
              onRowsPerPageChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value, 10),
                  page: 0,
                }))
              }
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}
        </Box>
      </Paper>

      <Dialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent>
          <UserForm
            initialData={editingUser || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
