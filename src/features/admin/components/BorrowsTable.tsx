import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import { MoreVertical, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BorrowData {
  id: number;
  user_id: string;
  fullname: string;
  email: string;
  student_id?: string;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  signature?: string;
  items?: Array<{
    copy_id: number;
    book_id: number;
    book_title: string;
    thumbnail_url?: string;
  }>;
}

interface BorrowsTableProps {
  borrows: BorrowData[];
  onStatusUpdate: (borrowId: number, newStatus: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BorrowsTable({
  borrows,
  onStatusUpdate,
  pagination,
  onPageChange,
  onRowsPerPageChange,
}: BorrowsTableProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const getStatusColor = (
    status: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning" => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "APPROVED":
        return "primary";
      case "ACTIVE":
        return "secondary";
      case "RETURNED":
        return "success";
      case "OVERDUE":
        return "error";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "APPROVED":
        return "Đã duyệt";
      case "ACTIVE":
        return "Đang mượn";
      case "RETURNED":
        return "Đã trả";
      case "CANCELLED":
        return "Đã hủy";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    borrow: BorrowData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedBorrow(borrow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetail = () => {
    setDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleChangeStatus = () => {
    if (selectedBorrow) {
      setNewStatus(selectedBorrow.status);
      setStatusDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleSaveStatus = () => {
    if (selectedBorrow && newStatus) {
      onStatusUpdate(selectedBorrow.id, newStatus);
      setStatusDialogOpen(false);
    }
  };

  const getAvailableStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case "PENDING":
        return ["CONFIRMED", "CANCELLED"];
      case "CONFIRMED":
        return ["APPROVED", "CANCELLED"];
      case "APPROVED":
        return ["ACTIVE", "CANCELLED"];
      case "ACTIVE":
        return ["RETURNED", "OVERDUE", "CANCELLED"];
      case "OVERDUE":
        return ["RETURNED", "CANCELLED"];
      default:
        return [];
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã phiếu</TableCell>
              <TableCell>Người mượn</TableCell>
              <TableCell>Số sách</TableCell>
              <TableCell>Ngày mượn</TableCell>
              <TableCell>Hạn trả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              borrows.map((borrow) => (
                <TableRow key={borrow.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      BRW-{String(borrow.id).padStart(6, "0")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        {borrow.fullname}
                      </Typography>
                      {borrow.student_id && (
                        <Typography variant="caption" color="text.secondary">
                          {borrow.student_id}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {borrow.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {borrow.items?.length || 0} quyển
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(borrow.borrow_date), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(borrow.due_date), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(borrow.status)}
                      color={getStatusColor(borrow.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, borrow)}
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
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
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleViewDetail}>
          <FileText size={18} style={{ marginRight: 8 }} />
          Xem chi tiết
        </MenuItem>
        {selectedBorrow &&
          getAvailableStatuses(selectedBorrow.status).length > 0 && (
            <MenuItem onClick={handleChangeStatus}>
              <Calendar size={18} style={{ marginRight: 8 }} />
              Đổi trạng thái
            </MenuItem>
          )}
        {selectedBorrow && selectedBorrow.status === "ACTIVE" && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              if (window.confirm("Gia hạn phiếu mượn này thêm 7 ngày?")) {
                // TODO: Admin có thể gia hạn cho user
                alert(
                  "Tính năng đang phát triển - Admin sẽ có API riêng để gia hạn cho user"
                );
              }
            }}
          >
            <Calendar size={18} style={{ marginRight: 8 }} />
            Gia hạn (+7 ngày)
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết phiếu mượn</DialogTitle>
        <DialogContent>
          {selectedBorrow && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin người mượn
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Họ tên:</strong> {selectedBorrow.fullname}
                  </Typography>
                  {selectedBorrow.student_id && (
                    <Typography variant="body2">
                      <strong>Mã SV:</strong> {selectedBorrow.student_id}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedBorrow.email}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Danh sách sách
                </Typography>
                <Stack spacing={1}>
                  {selectedBorrow.items?.map((item, index) => (
                    <Box
                      key={item.copy_id}
                      sx={{ display: "flex", gap: 1, alignItems: "center" }}
                    >
                      {item.thumbnail_url && (
                        <Avatar
                          src={item.thumbnail_url}
                          variant="rounded"
                          sx={{ width: 40, height: 60 }}
                        />
                      )}
                      <Typography variant="body2">
                        {index + 1}. {item.book_title}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {selectedBorrow.signature && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Chữ ký
                  </Typography>
                  <Typography variant="body2">
                    {selectedBorrow.signature}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Đổi trạng thái phiếu mượn</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ minWidth: 300, pt: 1 }}>
            <Typography variant="body2">Chọn trạng thái mới:</Typography>
            {selectedBorrow &&
              getAvailableStatuses(selectedBorrow.status).map((status) => (
                <Button
                  key={status}
                  variant={newStatus === status ? "contained" : "outlined"}
                  onClick={() => setNewStatus(status)}
                  fullWidth
                >
                  {getStatusLabel(status)}
                </Button>
              ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleSaveStatus}
            variant="contained"
            disabled={!newStatus}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
