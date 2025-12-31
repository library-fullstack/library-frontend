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
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
} from "@mui/material";
import { MoreVertical, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { borrowApi } from "@/features/borrow/api/borrow.api";
import type { BorrowPreviewData } from "@/features/borrow/api/borrow.api";
import type { ReturnReason } from "@/features/borrow/types/borrow.types";

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

const RETURN_REASON_LABELS: Record<string, string> = {
  GOOD_CONDITION: "Sách còn tốt",
  DAMAGED: "Sách hư hỏng",
  LOST: "Sách bị mất",
  WORN: "Sách rách / mềm",
  WATER_DAMAGED: "Sách bị nước",
  WRITTEN_ON: "Sách bị viết",
  STAINED: "Sách bị bẩn",
  DETERIORATED: "Sách mục",
  OTHER: "Khác",
};

export default function BorrowsTable({
  borrows,
  onStatusUpdate,
  pagination,
  onPageChange,
  onRowsPerPageChange,
}: BorrowsTableProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowData | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [selectedReturnReasons, setSelectedReturnReasons] = useState<string[]>(
    []
  );
  const [previewData, setPreviewData] = useState<BorrowPreviewData | null>(
    null
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

  const getAvailableStatuses = (status: string) => {
    switch (status) {
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
    e: React.MouseEvent<HTMLElement>,
    borrow: BorrowData
  ) => {
    setAnchorEl(e.currentTarget);
    setSelectedBorrow(borrow);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleViewDetail = async () => {
    if (!selectedBorrow) return;

    try {
      const res = await borrowApi.getBorrowPreview(selectedBorrow.id);

      if (res.success) {
        setPreviewData(res.data);
        setDetailOpen(true);
      }
    } catch (error) {
      console.error("Error fetching borrow preview:", error);
      alert("Không thể tải chi tiết phiếu mượn. Vui lòng thử lại.");
    }

    closeMenu();
  };

  const handleChangeStatus = () => {
    if (!selectedBorrow) return;
    setNewStatus(selectedBorrow.status);
    setStatusOpen(true);
    closeMenu();
  };

  const handleSaveStatus = () => {
    if (!selectedBorrow || !newStatus) return;

    if (selectedBorrow.status === "ACTIVE" && newStatus === "RETURNED") {
      setStatusOpen(false);
      setReturnOpen(true);
      setSelectedReturnReasons([]);
      return;
    }

    onStatusUpdate(selectedBorrow.id, newStatus);
    setStatusOpen(false);
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
            {borrows.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell>BRW-{String(b.id).padStart(6, "0")}</TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" fontWeight={500}>
                      {b.fullname}
                    </Typography>
                    {b.student_id && (
                      <Typography variant="caption">{b.student_id}</Typography>
                    )}
                    <Typography variant="caption">{b.email}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{b.items?.length || 0} quyển</TableCell>
                <TableCell>
                  {format(new Date(b.borrow_date), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(b.due_date), "dd/MM/yyyy", { locale: vi })}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={getStatusLabel(b.status)}
                    color={getStatusColor(b.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuOpen(e, b)}>
                    <MoreVertical size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
      />

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
        <MenuItem onClick={handleViewDetail}>
          <FileText size={16} /> &nbsp; Xem chi tiết
        </MenuItem>
        {selectedBorrow &&
          getAvailableStatuses(selectedBorrow.status).length > 0 && (
            <MenuItem onClick={handleChangeStatus}>
              <Calendar size={16} /> &nbsp; Đổi trạng thái
            </MenuItem>
          )}
      </Menu>

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Chi tiết phiếu mượn</DialogTitle>

        <DialogContent dividers>
          {previewData && (
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Thông tin người mượn
                </Typography>

                <Stack spacing={1}>
                  <Typography>
                    <b>Họ tên:</b> {previewData.fullname}
                  </Typography>
                  {previewData.student_id && (
                    <Typography>
                      <b>Mã SV:</b> {previewData.student_id}
                    </Typography>
                  )}
                  <Typography>
                    <b>Email:</b> {previewData.email}
                  </Typography>
                  <Typography>
                    <b>Ngày mượn:</b>{" "}
                    {format(new Date(previewData.borrow_date), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </Typography>
                  <Typography>
                    <b>Hạn trả:</b>{" "}
                    {format(new Date(previewData.due_date), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Danh sách sách mượn
                </Typography>

                <Stack spacing={1}>
                  {previewData.items && previewData.items.length > 0 ? (
                    previewData.items.map((item, idx) => (
                      <Box
                        key={item.copy_id}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.02)",
                          border: "1px solid",
                          borderColor: theme.palette.divider,
                        }}
                      >
                        <Typography>
                          {idx + 1}. {item.book_title}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Không có sách
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Tình trạng khi trả sách
                </Typography>

                {previewData.status === "RETURNED" ? (
                  <FormGroup>
                    {Object.entries(RETURN_REASON_LABELS).map(
                      ([value, label]) => {
                        const reason = value as ReturnReason;

                        return (
                          <FormControlLabel
                            key={value}
                            control={
                              <Checkbox
                                checked={
                                  previewData.return_reasons?.includes(
                                    reason
                                  ) || false
                                }
                                disabled
                              />
                            }
                            label={label}
                          />
                        );
                      }
                    )}
                  </FormGroup>
                ) : (
                  <Typography color="text.secondary">
                    Chưa có thông tin tình trạng.
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đổi trạng thái</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ minWidth: 320 }}>
            {selectedBorrow &&
              getAvailableStatuses(selectedBorrow.status).map((s) => (
                <Button
                  key={s}
                  variant={newStatus === s ? "contained" : "outlined"}
                  onClick={() => setNewStatus(s)}
                >
                  {getStatusLabel(s)}
                </Button>
              ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveStatus} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận trả sách</DialogTitle>
        <DialogContent>
          <FormGroup>
            {Object.entries(RETURN_REASON_LABELS).map(([v, l]) => (
              <FormControlLabel
                key={v}
                control={
                  <Checkbox
                    checked={selectedReturnReasons.includes(v)}
                    onChange={(e) =>
                      setSelectedReturnReasons((prev) =>
                        e.target.checked
                          ? [...prev, v]
                          : prev.filter((x) => x !== v)
                      )
                    }
                  />
                }
                label={l}
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            disabled={!selectedReturnReasons.length}
            onClick={() => {
              if (!selectedBorrow) return;
              onStatusUpdate(
                selectedBorrow.id,
                "RETURNED",
                selectedReturnReasons
              );
              setReturnOpen(false);
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
