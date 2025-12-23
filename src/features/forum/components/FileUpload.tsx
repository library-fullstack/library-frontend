import { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  LinearProgress,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Upload as UploadIcon,
  X as XIcon,
  Check as CheckIcon,
} from "lucide-react";
import axiosClient from "../../../shared/api/axiosClient";

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

interface FileUploadProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  accept?: string;
}

const FileUpload = ({
  onFilesUpload,
  maxFiles = 3,
  maxFileSize = 10,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx",
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setError(null);

    const totalFiles = uploadedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      setError(`Tối đa ${maxFiles} tệp được cho phép`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      let allowedSize = maxFileSize;
      if (file.type.startsWith("image/")) {
        allowedSize = 2;
      } else {
        allowedSize = 5;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > allowedSize) {
        setError(
          `Kích thước tệp phải ${allowedSize}MB hoặc nhỏ hơn (${
            file.name
          }: ${fileSizeMB.toFixed(2)}MB)`
        );
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post<{
        success: boolean;
        data: UploadedFile;
      }>("/forum/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedFile: UploadedFile = (
        response.data as { success: boolean; data: UploadedFile }
      ).data;
      setUploadedFiles((prev) => [...prev, uploadedFile]);
      onFilesUpload([...uploadedFiles, uploadedFile]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải tệp lên thất bại");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (filename: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.filename !== filename);
    setUploadedFiles(updatedFiles);
    onFilesUpload(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 3,
          textAlign: "center",
          border: "2px dashed",
          borderColor: dragActive ? "primary.main" : "divider",
          backgroundColor: dragActive ? "action.hover" : "background.paper",
          cursor: "pointer",
          transition: "all 0.2s",
          mb: 2,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon size={48} style={{ color: "#888", marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Kéo và thả tệp hoặc nhấp để chọn
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Hình ảnh tối đa 2MB, Tệp khác tối đa 5MB. Tối đa {maxFiles} tệp
        </Typography>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept={accept}
          onChange={handleChange}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Đang tải lên... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Tệp đã tải lên ({uploadedFiles.length}/{maxFiles})
          </Typography>
          {uploadedFiles.map((file) => (
            <Paper
              key={file.filename}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {file.originalName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatFileSize(file.size)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <CheckIcon size={20} color="green" />
                <IconButton
                  size="small"
                  onClick={() => removeFile(file.filename)}
                >
                  <XIcon size={18} />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default FileUpload;
