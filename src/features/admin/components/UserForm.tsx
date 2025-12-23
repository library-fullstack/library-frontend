import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
}

interface UserFormData {
  id?: string;
  email: string;
  fullname: string;
  student_id?: string;
  phone?: string;
  password?: string;
  role: "USER" | "ADMIN" | "LIBRARIAN" | "MODERATOR";
  is_active: boolean;
}

const ROLES = [
  { value: "USER", label: "Người dùng", color: "default" as const },
  { value: "LIBRARIAN", label: "Thủ thư", color: "primary" as const },
  { value: "MODERATOR", label: "Kiểm duyệt viên", color: "secondary" as const },
  { value: "ADMIN", label: "Quản trị viên", color: "error" as const },
];

export default function UserForm({
  initialData,
  onSubmit,
  onCancel,
}: UserFormProps): React.ReactElement {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      email: "",
      fullname: "",
      role: "USER",
      is_active: true,
      password: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ tên không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={!!initialData}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
              error={!!errors.fullname}
              helperText={errors.fullname}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mã sinh viên (tùy chọn)"
              value={formData.student_id || ""}
              onChange={(e) => handleChange("student_id", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Số điện thoại (tùy chọn)"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid>

          {!initialData && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu (tùy chọn)"
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                helperText="Để trống sẽ dùng mật khẩu mặc định: Matkhau@123"
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                label="Vai trò"
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>{role.label}</span>
                      <Chip
                        label={role.value}
                        size="small"
                        color={role.color}
                      />
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                />
              }
              label="Tài khoản hoạt động"
            />
          </Grid>

          <Grid size={12}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "info.50" }}>
              <Typography variant="subtitle2" color="info.main" gutterBottom>
                Quyền hạn theo vai trò:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  • <strong>Người dùng:</strong> Mượn/trả sách, xem lịch sử
                </Typography>
                <Typography variant="body2">
                  • <strong>Thủ thư:</strong> Quản lý mượn/trả, quản lý sách
                </Typography>
                <Typography variant="body2">
                  • <strong>Kiểm duyệt viên:</strong> Quản lý diễn đàn, kiểm
                  duyệt bài viết
                </Typography>
                <Typography variant="body2">
                  • <strong>Quản trị viên:</strong> Toàn quyền hệ thống
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onCancel} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? "Đang lưu..."
                  : initialData
                  ? "Cập nhật"
                  : "Thêm người dùng"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
