import React, { useState, useEffect } from "react";
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
  Snackbar,
} from "@mui/material";
import { Search, Plus } from "lucide-react";
import BooksList from "../../features/admin/components/BooksList";
import BookForm from "../../features/admin/components/BookForm";
import axiosClient from "../../shared/api/axiosClient";
import { parseApiError } from "../../shared/lib/errorHandler";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  isbn?: string;
  call_number?: string;
  language_code?: string;
  format?: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  total_copies: number;
  available_copies: number;
}

interface BookFormData {
  id?: number;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  isbn?: string;
  call_number?: string;
  language_code?: string;
  format?: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  total_copies: number;
}

export default function BooksManagement(): React.ReactElement {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
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

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const params: Record<string, string | number> = {
          page: pagination.page + 1,
          limit: pagination.limit,
        };
        if (search) params.search = search;

        const response = await axiosClient.get("/books", { params });
        const data = response.data as {
          success: boolean;
          data: Book[];
          pagination?: { total: number };
        };

        if (data.success) {
          setBooks(data.data || []);
          setPagination((prev) => ({
            ...prev,
            total: Number(data.pagination?.total) || 0,
          }));
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pagination.page, pagination.limit, search]);

  const handleSubmit = async (formData: BookFormData) => {
    try {
      if (editingBook) {
        await axiosClient.put(`/books/${editingBook.id}`, formData);
        setSnackbar({
          open: true,
          message: "Cập nhật sách thành công!",
          severity: "success",
        });
      } else {
        await axiosClient.post("/books", formData);
        setSnackbar({
          open: true,
          message: "Thêm sách mới thành công!",
          severity: "success",
        });
      }
      setFormOpen(false);
      setEditingBook(null);
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

  const handleDeleteClick = (bookId: number) => {
    setBookToDelete(bookId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    try {
      await axiosClient.delete(`/books/${bookToDelete}`);
      setSnackbar({
        open: true,
        message: "Xóa sách thành công!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setBookToDelete(null);
      setPagination((prev) => ({ ...prev, page: 0 }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: parseApiError(err),
        severity: "error",
      });
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  const handleView = (book: Book) => {
    window.open(`/books/${book.id}`, "_blank");
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
              Quản lý sách
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý thông tin sách trong thư viện
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => {
              setEditingBook(null);
              setFormOpen(true);
            }}
          >
            Thêm sách mới
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ width: "100%", p: 2 }}>
        <TextField
          placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
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
          <BooksList
            books={books}
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
            onView={handleView}
          />
        )}
      </Paper>

      <Dialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingBook(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingBook ? "Chỉnh sửa sách" : "Thêm sách mới"}
        </DialogTitle>
        <DialogContent>
          <BookForm
            initialData={editingBook || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditingBook(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa sách</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn
            tác.
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
