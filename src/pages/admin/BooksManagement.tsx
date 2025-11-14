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
} from "@mui/material";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { statisticsApi } from "../../features/admin/api/statistics.api";
import { parseApiError } from "../../shared/lib/errorHandler";
import logger from "@/shared/lib/logger";

interface Book {
  id: string | number;
  title: string;
  author_names: string;
  category_name: string;
  publisher_name: string;
  status: string;
  copies_count: number;
  available_count: number;
  created_at: string;
}

export default function BooksManagement() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const createMockBooks = useCallback((): Book[] => {
    const mockData: Book[] = [];
    for (let i = 1; i <= rowsPerPage; i++) {
      mockData.push({
        id: i + page * rowsPerPage,
        title: `Sách mẫu ${i + page * rowsPerPage}`,
        author_names: `Tác giả ${i}`,
        category_name: ["Khoa học", "Văn học", "Công nghệ"][i % 3],
        publisher_name: `NXB ${i}`,
        status: ["ACTIVE", "INACTIVE", "DRAFT"][i % 3],
        copies_count: Math.floor(Math.random() * 20) + 5,
        available_count: Math.floor(Math.random() * 10) + 1,
        created_at: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
    return mockData;
  }, [page, rowsPerPage]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await statisticsApi.getBookManagement({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      logger.log("[BooksManagement] Phản hồi từ API: ", response);
      setBooks(response.data.books || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      logger.error("[BooksManagement] Lỗi API:", err);
      setError(parseApiError(err));
      setBooks(createMockBooks());
      setTotal(50);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter, createMockBooks]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, book: Book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBook(null);
  };

  const handleView = () => {
    if (selectedBook) {
      navigate(`/books/${selectedBook.id}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedBook) {
      navigate(`/admin/books/${selectedBook.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedBook) {
      logger.log("Xoá sách:", selectedBook.id);
    }
    handleMenuClose();
  };

  const getStatusColor = (
    status: string
  ): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      case "DRAFT":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Ngừng";
      case "DRAFT":
        return "Nháp";
      default:
        return status;
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
              Quản lý sách
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý toàn bộ sách trong thư viện
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/admin/books/new")}
            sx={{ fontWeight: 600, alignSelf: { xs: "stretch", sm: "auto" } }}
          >
            Thêm sách mới
          </Button>
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
              placeholder="Tìm kiếm sách..."
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
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                <MenuItem value="INACTIVE">Ngừng</MenuItem>
                <MenuItem value="DRAFT">Nháp</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Tên sách
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Tác giả
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Danh mục
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  NXB
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Số bản
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Còn lại
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
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
                    {Array.from({ length: 9 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !books || books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <BookOpen
                      size={48}
                      style={{ opacity: 0.3, marginBottom: 16 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy sách nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow
                    key={book.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {book.id}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {book.author_names}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {book.category_name}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {book.publisher_name}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Chip
                        label={getStatusLabel(book.status)}
                        size="small"
                        color={getStatusColor(book.status)}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {book.copies_count}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={
                          book.available_count === 0
                            ? "error.main"
                            : "success.main"
                        }
                      >
                        {book.available_count}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, book)}
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
          <MenuItem onClick={handleView}>
            <Eye size={18} style={{ marginRight: 8 }} />
            Xem chi tiết
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <Edit size={18} style={{ marginRight: 8 }} />
            Chỉnh sửa
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Trash2 size={18} style={{ marginRight: 8 }} />
            Xóa
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
