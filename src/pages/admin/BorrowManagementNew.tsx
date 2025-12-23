import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Search } from "lucide-react";
import BorrowsTable from "../../features/admin/components/BorrowsTable";
import axiosClient from "../../shared/api/axiosClient";
import { parseApiError } from "../../shared/lib/errorHandler";

export default function BorrowManagement(): React.ReactElement {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [borrows, setBorrows] = useState<BorrowData[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const statusTabs = [
    { label: "Tất cả", value: "", count: 0 },
    { label: "Chờ xác nhận", value: "PENDING", count: 0 },
    { label: "Đã xác nhận", value: "CONFIRMED", count: 0 },
    { label: "Đã duyệt", value: "APPROVED", count: 0 },
    { label: "Đang mượn", value: "ACTIVE", count: 0 },
    { label: "Đã trả", value: "RETURNED", count: 0 },
    { label: "Đã hủy", value: "CANCELLED", count: 0 },
  ];

  const fetchBorrows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string | number> = {
        page: pagination.page + 1,
        limit: pagination.limit,
      };

      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await axiosClient.get("/borrows/admin/all", { params });

      const data = response.data as {
        success: boolean;
        data: BorrowData[];
        pagination?: { total: number; totalPages: number };
      };

      if (data.success) {
        setBorrows(data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setStatusFilter(statusTabs[newValue].value);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleStatusUpdate = async (borrowId: number, newStatus: string) => {
    try {
      await axiosClient.patch(`/borrows/admin/${borrowId}/status`, {
        status: newStatus,
      });
      setError("");
      fetchBorrows();
    } catch (err) {
      const errorMsg = parseApiError(err);
      setError(errorMsg);
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Quản lý mượn sách
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý và theo dõi tất cả phiếu mượn sách
        </Typography>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            px: 2,
          }}
        >
          {statusTabs.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} id={`borrow-tab-${index}`} />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              placeholder="Tìm kiếm theo tên, email, mã SV..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

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
            <BorrowsTable
              borrows={borrows}
              onStatusUpdate={handleStatusUpdate}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}

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
