import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import {
  Search,
  Plus,
  MoreVertical,
  Trash2,
  Shield,
  UserX,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { statisticsApi } from "../../features/admin/api/statistics.api";
import { settingsApi } from "../../features/admin/api/settings.api";
import { parseApiError } from "../../shared/lib/errorHandler";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import logger from "@/shared/lib/logger";

interface User {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  class_name: string | null;
  faculty: string | null;
  created_at: string;
}

export default function UsersManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [allowStudentInfoEdit, setAllowStudentInfoEdit] = useState(true);
  const [loadingInfoEditSetting, setLoadingInfoEditSetting] = useState(false);

  const createMockUsers = useCallback((): User[] => {
    const roles = ["STUDENT", "LIBRARIAN", "MODERATOR", "ADMIN"];
    const mockData: User[] = [];
    for (let i = 1; i <= rowsPerPage; i++) {
      const roleIndex = i % roles.length;
      mockData.push({
        id: `mock-${i + page * rowsPerPage}`,
        student_id: `SV${String(i + page * rowsPerPage).padStart(6, "0")}`,
        full_name: `Người dùng ${i + page * rowsPerPage}`,
        email: `user${i + page * rowsPerPage}@example.com`,
        role: roles[roleIndex],
        status: Math.random() > 0.2 ? "ACTIVE" : "INACTIVE",
        class_name: i % 2 === 0 ? `Lớp ${i}A` : null,
        faculty:
          i % 2 === 0 ? `Khoa ${i % 3 === 0 ? "CNTT" : "Kinh tế"}` : null,
        created_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
    return mockData;
  }, [page, rowsPerPage]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await statisticsApi.getUserManagement({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(response.data.users || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(parseApiError(err));
      setUsers(createMockUsers());
      setTotal(50);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, roleFilter, createMockUsers]);

  useEffect(() => {
    fetchUsers();
    loadAllowStudentInfoEditSetting();
  }, [fetchUsers]);

  const loadAllowStudentInfoEditSetting = async () => {
    try {
      setLoadingInfoEditSetting(true);
      const setting = await settingsApi.getSetting("allow_student_info_edit");
      if (setting) {
        const value = setting.setting_value;
        const isAllowed =
          value === "1" || value === "true" || (value as unknown) === true;
        setAllowStudentInfoEdit(isAllowed);
      } else {
        setAllowStudentInfoEdit(false);
      }
    } catch (err) {
      logger.error(
        "Lỗi khi tải cài đặt cho phép chỉnh sửa thông tin sinh viên:",
        err
      );
      setAllowStudentInfoEdit(false);
    } finally {
      setLoadingInfoEditSetting(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleAllowStudentInfoEdit = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const isAllowed = event.target.checked;
      setAllowStudentInfoEdit(isAllowed);
      setLoadingInfoEditSetting(true);

      await settingsApi.updateSetting(
        "allow_student_info_edit",
        isAllowed ? "1" : "0",
        "Cho phép sinh viên chỉnh sửa thông tin sau khi đăng ký"
      );
    } catch (err) {
      setError(parseApiError(err));
      setAllowStudentInfoEdit(!event.target.checked);
    } finally {
      setLoadingInfoEditSetting(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleChangeRole = () => {
    if (selectedUser) {
      setNewRole(selectedUser.role);
      setRoleDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleSaveRole = async () => {
    if (selectedUser) {
      try {
        await statisticsApi.updateUserRole(selectedUser.id, newRole);
        fetchUsers();
      } catch (err) {
        logger.error("Lỗi khi cập nhật vai trò:", err);
      }
    }
    setRoleDialogOpen(false);
  };

  const handleToggleStatus = async () => {
    if (selectedUser) {
      try {
        const newStatus =
          selectedUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await statisticsApi.updateUserStatus(selectedUser.id, newStatus);
        fetchUsers();
      } catch (err) {
        logger.error("Lỗi khi cập nhật trạng thái:", err);
      }
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await statisticsApi.deleteUser(selectedUser.id);
        fetchUsers();
      } catch (err) {
        logger.error("Lỗi khi xóa người dùng:", err);
      }
    }
    handleMenuClose();
  };

  const getRoleColor = (
    role: string
  ): "error" | "warning" | "info" | "primary" | "default" => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "MODERATOR":
        return "warning";
      case "LIBRARIAN":
        return "info";
      case "STUDENT":
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "MODERATOR":
        return "Điều hành viên";
      case "LIBRARIAN":
        return "Thủ thư";
      case "STUDENT":
        return "Sinh viên";
      default:
        return role;
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 2, sm: 3, md: 4 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
            >
              Quản lý người dùng
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý tài khoản và phân quyền người dùng
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 1.5, sm: 2 },
                py: 1,
                bgcolor: "action.hover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  whiteSpace: "nowrap",
                }}
              >
                Sửa thông tin khi đăng ký:
              </Typography>
              <Switch
                checked={allowStudentInfoEdit}
                onChange={handleToggleAllowStudentInfoEdit}
                disabled={loadingInfoEditSetting}
                size="small"
              />
              <Typography
                variant="caption"
                sx={{
                  color: allowStudentInfoEdit
                    ? "success.main"
                    : "text.secondary",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                {loadingInfoEditSetting
                  ? "..."
                  : allowStudentInfoEdit
                  ? "Bật"
                  : "Tắt"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate("/admin/users/new")}
              sx={{
                alignSelf: { xs: "stretch", sm: "auto" },
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Thêm người dùng
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Đang sử dụng dữ liệu mẫu. {error}
          </Alert>
        )}

        <Paper elevation={0} sx={{ mb: 3 }}>
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Tìm kiếm người dùng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 auto" },
                minWidth: { xs: "100%", sm: 250 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: { xs: "100%", sm: 150 } }}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={roleFilter}
                label="Vai trò"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="STUDENT">Sinh viên</MenuItem>
                <MenuItem value="LIBRARIAN">Thủ thư</MenuItem>
                <MenuItem value="MODERATOR">Điều hành viên</MenuItem>
                <MenuItem value="ADMIN">Quản trị viên</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ overflowX: "auto" }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Người dùng
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  MSSV
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Vai trò
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Lớp/Khoa
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Tham gia
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                  align="right"
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Shield
                      size={48}
                      style={{ opacity: 0.3, marginBottom: 16 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy người dùng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      opacity: user.status === "ACTIVE" ? 1 : 0.6,
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: { xs: 28, sm: 36 },
                            height: { xs: 28, sm: 36 },
                            bgcolor: "primary.main",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {user.full_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            display: { xs: "block", sm: "inline" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: { xs: 150, sm: "auto" },
                          }}
                        >
                          {user.full_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.student_id}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Chip
                        label={getRoleLabel(user.role)}
                        size="small"
                        color={getRoleColor(user.role)}
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.class_name && user.faculty ? (
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.class_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.faculty}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Chưa cập nhật
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Chip
                        label={
                          user.status === "ACTIVE"
                            ? "Hoạt động"
                            : user.status === "BANNED"
                            ? "Bị cấm"
                            : "Bị khóa"
                        }
                        size="small"
                        color={user.status === "ACTIVE" ? "success" : "error"}
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(user.created_at), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong tổng số ${count}`
            }
          />
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          disableScrollLock={true}
        >
          <MenuItem onClick={handleChangeRole}>
            <Shield size={18} style={{ marginRight: 8 }} />
            Đổi vai trò
          </MenuItem>
          <MenuItem onClick={handleToggleStatus}>
            {selectedUser?.status === "ACTIVE" ? (
              <>
                <UserX size={18} style={{ marginRight: 8 }} />
                Khóa tài khoản
              </>
            ) : (
              <>
                <UserCheck size={18} style={{ marginRight: 8 }} />
                Mở khóa tài khoản
              </>
            )}
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Trash2 size={18} style={{ marginRight: 8 }} />
            Xóa người dùng
          </MenuItem>
        </Menu>

        <Dialog
          open={roleDialogOpen}
          onClose={() => setRoleDialogOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 0,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              pb: 1,
            }}
          >
            Đổi vai trò người dùng
          </DialogTitle>

          <DialogContent
            sx={{
              px: 3,
              pt: 1,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel id="role-label">Vai trò mới</InputLabel>
              <Select
                labelId="role-label"
                label="Vai trò mới"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MenuItem value="STUDENT">Sinh viên</MenuItem>
                <MenuItem value="LIBRARIAN">Thủ thư</MenuItem>
                <MenuItem value="MODERATOR">Kiểm duyệt viên</MenuItem>
                <MenuItem value="ADMIN">Quản trị viên</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2,
              pt: 1,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              onClick={() => setRoleDialogOpen(false)}
              variant="text"
              sx={{ fontWeight: 500 }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveRole}
              sx={{ fontWeight: 600 }}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
