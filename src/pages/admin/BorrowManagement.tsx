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
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { MoreVertical, Calendar } from "lucide-react";
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
  onStatusUpdate: (
    borrowId: number,
    newStatus: string,
    reasons?: string[]
  ) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RETURN_REASONS = [
  { value: "GOOD_CONDITION", label: "Sách còn tốt" },
  { value: "DAMAGED", label: "Sách hư hỏng (phí 30%)" },
  { value: "LOST", label: "Sách mất (phí 100%)" },
  { value: "WORN", label: "Sách rách / mềm bìa (phí 15%)" },
  { value: "WATER_DAMAGED", label: "Sách bị nước (phí 50%)" },
  { value: "WRITTEN_ON", label: "Sách bị viết vào (phí 20%)" },
  { value: "STAINED", label: "Sách bị dịch / dấu vết (phí 10%)" },
  { value: "DETERIORATED", label: "Sách mục nát (phí 40%)" },
  { value: "OTHER", label: "Khác (liên hệ quản lý)" },
];

export default function BorrowsTable({
  borrows,
  onStatusUpdate,
  pagination,
  onPageChange,
  onRowsPerPageChange,
}: BorrowsTableProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowData | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [selectedReturnReasons, setSelectedReturnReasons] = useState<string[]>(
    []
  );

  const getStatusColor = (status: string) => {
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
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
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
      case "OVERDUE":
        return "Quá hạn";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
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

  const handleChangeStatus = () => {
    if (!selectedBorrow) return;
    setNewStatus(selectedBorrow.status);
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveStatus = () => {
    if (!selectedBorrow || !newStatus) return;

    if (selectedBorrow.status === "ACTIVE" && newStatus === "RETURNED") {
      setStatusDialogOpen(false);
      setReturnDialogOpen(true);
      setSelectedReturnReasons([]);
      return;
    }

    onStatusUpdate(selectedBorrow.id, newStatus);
    setStatusDialogOpen(false);
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
                  <TableCell>{borrow.items?.length || 0} quyển</TableCell>
                  <TableCell>
                    {format(new Date(borrow.borrow_date), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(borrow.due_date), "dd/MM/yyyy", {
                      locale: vi,
                    })}
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
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleChangeStatus}>
          <Calendar size={18} style={{ marginRight: 8 }} />
          Đổi trạng thái
        </MenuItem>
      </Menu>

      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Đổi trạng thái</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {selectedBorrow &&
              getAvailableStatuses(selectedBorrow.status).map((status) => (
                <Button
                  key={status}
                  variant={newStatus === status ? "contained" : "outlined"}
                  onClick={() => setNewStatus(status)}
                >
                  {getStatusLabel(status)}
                </Button>
              ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveStatus} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
      >
        <DialogTitle>Xác nhận trả sách</DialogTitle>
        <DialogContent>
          <FormGroup>
            {RETURN_REASONS.map((r) => (
              <FormControlLabel
                key={r.value}
                control={
                  <Checkbox
                    checked={selectedReturnReasons.includes(r.value)}
                    onChange={(e) =>
                      setSelectedReturnReasons((prev) =>
                        e.target.checked
                          ? [...prev, r.value]
                          : prev.filter((x) => x !== r.value)
                      )
                    }
                  />
                }
                label={r.label}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            disabled={selectedReturnReasons.length === 0}
            onClick={() => {
              if (!selectedBorrow) return;
              onStatusUpdate(
                selectedBorrow.id,
                "RETURNED",
                selectedReturnReasons
              );
              setReturnDialogOpen(false);
              setSelectedReturnReasons([]);
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
