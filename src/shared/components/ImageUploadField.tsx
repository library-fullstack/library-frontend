import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { X, Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<{ url: string; public_id?: string }>;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  error?: boolean;
}

export default function ImageUploadField({
  value,
  onChange,
  onUpload,
  label = "Ảnh",
  helperText,
  disabled = false,
  error = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Kích thước file không được vượt quá 5MB");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      const result = await onUpload(file);
      onChange(result.url);
    } catch (err: unknown) {
      const error = err as Error;
      setUploadError(error.message || "Upload thất bại");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearImage = () => {
    onChange("");
    setUploadError("");
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      {value ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            position: "relative",
            "&:hover .clear-btn": {
              opacity: 1,
            },
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{
              width: "100%",
              maxHeight: 200,
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
          <IconButton
            className="clear-btn"
            size="small"
            onClick={handleClearImage}
            disabled={disabled || uploading}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "background.paper",
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": {
                bgcolor: "error.main",
                color: "white",
              },
            }}
          >
            <X size={18} />
          </IconButton>
        </Paper>
      ) : (
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={disabled || uploading}
          />
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              cursor: disabled || uploading ? "not-allowed" : "pointer",
              borderStyle: "dashed",
              borderWidth: 2,
              bgcolor: "action.hover",
              "&:hover": {
                bgcolor:
                  disabled || uploading ? "action.hover" : "action.selected",
              },
            }}
            onClick={() =>
              !disabled && !uploading && fileInputRef.current?.click()
            }
          >
            {uploading ? (
              <CircularProgress size={40} />
            ) : (
              <Stack spacing={1} alignItems="center">
                <ImageIcon size={40} color="gray" />
                <Typography variant="body2" color="text.secondary">
                  Click để chọn ảnh
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hoặc kéo thả file vào đây
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  PNG, JPG, GIF tối đa 5MB
                </Typography>
              </Stack>
            )}
          </Paper>
        </Box>
      )}

      {(helperText || uploadError) && (
        <Typography
          variant="caption"
          color={uploadError || error ? "error" : "text.secondary"}
          sx={{ mt: 1, display: "block" }}
        >
          {uploadError || helperText}
        </Typography>
      )}

      {!value && !uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Hoặc nhập URL ảnh:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={disabled}
            error={error}
          />
        </Box>
      )}
    </Box>
  );
}
