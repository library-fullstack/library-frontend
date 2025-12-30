import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Plus as PlusIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forumApi } from "../../features/forum/api/forum.api";
import { ForumCategory } from "../../features/forum/types/forum.types";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_locked: boolean;
  allowed_roles?: string;
  created_at?: string;
}

const ROLES = ["STUDENT", "LIBRARIAN", "MODERATOR", "ADMIN"];

export default function ForumCategoriesPanel() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_locked: false,
    allowed_roles: ROLES,
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["forumCategories"],
    queryFn: async () => {
      const response = await forumApi.getCategories();
      const data = response.data?.data || [];
      return data.map((cat: ForumCategory) => ({
        ...cat,
        description: cat.description ?? undefined,
        is_locked: Boolean(cat.is_locked),
      }));
    },
  });

  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => Promise.resolve(forumApi.createCategory(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumCategories"] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (params: any) =>
      Promise.resolve(forumApi.updateCategory(params.id, params.data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumCategories"] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve(forumApi.deleteCategory(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumCategories"] });
    },
  });

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        sort_order: category.sort_order,
        is_locked: category.is_locked,
        allowed_roles: category.allowed_roles
          ? category.allowed_roles.split(",")
          : ROLES,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        sort_order: 0,
        is_locked: false,
        allowed_roles: ROLES,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      allowed_roles: formData.allowed_roles.join(","),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        allowed_roles: [...formData.allowed_roles, role],
      });
    } else {
      setFormData({
        ...formData,
        allowed_roles: formData.allowed_roles.filter((r) => r !== role),
      });
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <h2>Quản lý chủ đề diễn đàn</h2>
        <Button
          variant="contained"
          startIcon={<PlusIcon size={20} />}
          onClick={() => handleOpenDialog()}
        >
          Thêm chủ đề
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
              }}
            >
              <TableCell>Tên chủ đề</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Quyền cho phép</TableCell>
              <TableCell>Đã khóa</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(categories as Category[])?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {category.allowed_roles?.split(",").map((role) => (
                      <Chip
                        key={role}
                        label={role}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {category.is_locked ? (
                    <LockIcon size={20} />
                  ) : (
                    <LockOpenIcon size={20} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <EditIcon size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteMutation.mutate(category.id)}
                  >
                    <DeleteIcon size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Sửa chủ đề" : "Thêm chủ đề mới"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tên chủ đề"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Thứ tự"
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              setFormData({ ...formData, sort_order: parseInt(e.target.value) })
            }
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <h4>Cho phép vai trò</h4>
            <FormGroup>
              {ROLES.map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={formData.allowed_roles.includes(role)}
                      onChange={(e) => handleRoleChange(role, e.target.checked)}
                    />
                  }
                  label={role}
                />
              ))}
            </FormGroup>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_locked}
                onChange={(e) =>
                  setFormData({ ...formData, is_locked: e.target.checked })
                }
              />
            }
            label="Khóa chủ đề"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              "Lưu"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
