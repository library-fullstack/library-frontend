import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  Chip,
} from "@mui/material";
import { Ban as BanIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ForumUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
}

export default function ForumUsersPanel() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ForumUser | null>(null);
  const [banReason, setBanReason] = useState("");

  const mockUsers: ForumUser[] = [
    {
      id: "1",
      full_name: "Nguyễn Văn A",
      email: "a@example.com",
      role: "STUDENT",
      status: "ACTIVE",
    },
    {
      id: "2",
      full_name: "Trần Thị B",
      email: "b@example.com",
      role: "MODERATOR",
      status: "ACTIVE",
    },
  ];

  const handleBanUser = (user: ForumUser) => {
    setSelectedUser(user);
    setBanReason("");
    setOpenDialog(true);
  };

  const handleSubmitBan = () => {
    // Call API to ban user
    console.log("Ban user:", selectedUser?.id, "Reason:", banReason);
    setOpenDialog(false);
    queryClient.invalidateQueries({ queryKey: ["forumUsers"] });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <h2>Quản lý người dùng diễn đàn</h2>
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
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    color={user.status === "ACTIVE" ? "success" : "error"}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleBanUser(user)}
                    title="Cấm người dùng"
                  >
                    <BanIcon size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cấm người dùng: {selectedUser?.full_name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Lý do cấm"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            multiline
            rows={4}
            placeholder="Nhập lý do cấm người dùng này..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmitBan} variant="contained" color="error">
            Cấm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
