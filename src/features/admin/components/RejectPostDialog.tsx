import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

interface RejectPostDialogProps {
  open: boolean;
  postTitle: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export default function RejectPostDialog({
  open,
  postTitle,
  onClose,
  onConfirm,
  loading = false,
}: RejectPostDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Từ chối bài viết</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Bài viết: <strong>{postTitle}</strong>
          </Typography>
        </Box>
        <TextField
          autoFocus
          multiline
          rows={4}
          fullWidth
          label="Lý do từ chối *"
          placeholder="Vui lòng cho biết lý do từ chối bài viết này..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={reason.trim().length === 0 && reason.length > 0}
          helperText="Lý do từ chối sẽ được gửi cho tác giả"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={!reason.trim() || loading}
        >
          Từ chối
        </Button>
      </DialogActions>
    </Dialog>
  );
}
