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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Search, MoreVertical, CheckCircle, Clock } from "lucide-react";
import { statisticsApi } from "../../features/admin/api/statistics.api";
import { parseApiError } from "../../shared/lib/errorHandler";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Borrow {
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
}

export default function BorrowManagement() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const createMockBorrows = useCallback((): Borrow[] => {
    const statuses = ["BORROWED", "RETURNED", "OVERDUE"];
    const mockData: Borrow[] = [];
    for (let i = 1; i <= rowsPerPage; i++) {
      const status = statuses[i % statuses.length];
      const borrowDate = new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000);
      const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const returnDate =
        status === "RETURNED"
          ? new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000)
          : null;

      mockData.push({
        id: i + page * rowsPerPage,
        book_id: Math.floor(Math.random() * 1000) + 1,
        book_title: `Sách ${i + page * rowsPerPage}`,
        user_id: Math.floor(Math.random() * 500) + 1,
        user_name: `Người dùng ${i}`,
        student_id: `SV${String(i + page * rowsPerPage).padStart(6, "0")}`,
        borrowed_at: borrowDate.toISOString(),
        due_date: dueDate.toISOString(),
        returned_at: returnDate ? returnDate.toISOString() : null,
        status,
      });
    }
    return mockData;
  }, [page, rowsPerPage]);

  const fetchBorrows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await statisticsApi.getBorrowManagement({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setBorrows(response.data.borrows || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      const errorMessage = parseApiError(err);
      setError(errorMessage);
      setBorrows(createMockBorrows());
      setTotal(rowsPerPage * 10);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter, createMockBorrows]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    borrow: Borrow
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedBorrow(borrow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBorrow(null);
  };

  const handleChangeStatus = () => {
    if (selectedBorrow) {
      setNewStatus(selectedBorrow.status);
      setStatusDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleSaveStatus = async () => {
    if (selectedBorrow) {
      try {
        await statisticsApi.updateBorrowStatus(selectedBorrow.id, newStatus);
        fetchBorrows();
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
    setStatusDialogOpen(false);
  };

  const getStatusColor = (
    status: string
  ): "primary" | "success" | "error" | "default" => {
    switch (status.toUpperCase()) {
      case "BORROWED":
        return "primary";
      case "RETURNED":
        return "success";
      case "OVERDUE":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "BORROWED":
        return "Đang mượn";
      case "RETURNED":
        return "Đã trả";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "RETURNED") return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Quản lý mượn trả
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi và quản lý các giao dịch mượn sách
          </Typography>
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
              placeholder="Tìm kiếm theo sách hoặc người dùng..."
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
                <MenuItem value="BORROWED">Đang mượn</MenuItem>
                <MenuItem value="RETURNED">Đã trả</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Mã GD
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Sách
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Người mượn
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  MSSV
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Ngày mượn
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Hạn trả
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Ngày trả
                </TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  Trạng thái
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
              ) : borrows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Clock
                      size={48}
                      style={{ opacity: 0.3, marginBottom: 16 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy giao dịch nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                borrows.map((borrow) => {
                  const overdueStatus = isOverdue(
                    borrow.due_date,
                    borrow.status
                  );
                  return (
                    <TableRow
                      key={borrow.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                        bgcolor: overdueStatus
                          ? (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(248, 113, 113, 0.08)"
                                : "rgba(239, 68, 68, 0.04)"
                          : "transparent",
                      }}
                    >
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2" fontWeight={600}>
                          #{borrow.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {borrow.book_title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {borrow.user_name}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {borrow.student_id}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2">
                          {format(new Date(borrow.borrowed_at), "dd/MM/yyyy")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(borrow.borrowed_at), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          variant="body2"
                          color={overdueStatus ? "error.main" : "text.primary"}
                          fontWeight={overdueStatus ? 600 : 400}
                        >
                          {format(new Date(borrow.due_date), "dd/MM/yyyy")}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {borrow.returned_at ? (
                          <Typography variant="body2" color="success.main">
                            {format(new Date(borrow.returned_at), "dd/MM/yyyy")}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Chưa trả
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Chip
                          label={getStatusLabel(borrow.status)}
                          size="small"
                          color={getStatusColor(borrow.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, borrow)}
                        >
                          <MoreVertical size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
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
          <MenuItem onClick={handleChangeStatus}>
            <CheckCircle size={18} style={{ marginRight: 8 }} />
            Đổi trạng thái
          </MenuItem>
          {selectedBorrow?.status !== "RETURNED" && (
            <MenuItem
              onClick={() => {
                setNewStatus("RETURNED");
                handleSaveStatus();
              }}
              sx={{ color: "success.main" }}
            >
              <CheckCircle size={18} style={{ marginRight: 8 }} />
              Xác nhận đã trả
            </MenuItem>
          )}
        </Menu>

        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
        >
          <DialogTitle>Đổi trạng thái giao dịch</DialogTitle>
          <DialogContent sx={{ minWidth: 300, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái mới</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái mới"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="BORROWED">Đang mượn</MenuItem>
                <MenuItem value="RETURNED">Đã trả</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleSaveStatus}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
