import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { format } from "date-fns";
import { useNews, useDeleteNews } from "../../features/news/hooks/useNewsQuery";
import { NewsCategory, NewsStatus } from "../../shared/types/news.types";
import { useSnackbar } from "notistack";
import NewsFormDialog from "../../features/admin/components/NewsFormDialog";

const categoryLabels: Record<NewsCategory, string> = {
  ANNOUNCEMENT: "Thông báo",
  GUIDE: "Hướng dẫn",
  UPDATE: "Cập nhật",
  OTHER: "Khác",
};

const statusLabels: Record<NewsStatus, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Lưu trữ",
};

export default function AdminNewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<NewsCategory | "">("");
  const [status, setStatus] = useState<NewsStatus | "">("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data } = useNews({
    page,
    limit: 10,
    search,
    category: category || undefined,
    status: status || undefined,
  });

  const deleteMutation = useDeleteNews();
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = (id: number) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await deleteMutation.mutateAsync(deletingId);
        enqueueSnackbar("Xóa tin tức thành công", { variant: "success" });
        setDeleteDialogOpen(false);
      } catch {
        enqueueSnackbar("Xóa tin tức thất bại", { variant: "error" });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Quản lý Tin tức
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingId(null);
            setFormOpen(true);
          }}
        >
          Thêm tin tức
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={category}
              label="Danh mục"
              onChange={(e) => setCategory(e.target.value as NewsCategory | "")}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              label="Trạng thái"
              onChange={(e) => setStatus(e.target.value as NewsStatus | "")}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày xuất bản</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((news) => (
              <TableRow key={news.id}>
                <TableCell>{news.id}</TableCell>
                <TableCell>{news.title}</TableCell>
                <TableCell>
                  <Chip label={categoryLabels[news.category]} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[news.status]}
                    size="small"
                    color={news.status === "PUBLISHED" ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(news.published_at), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{news.author_name || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(news.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(news.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data && data.pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={data.pagination.totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}

      <NewsFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editingId={editingId}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa tin tức này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
