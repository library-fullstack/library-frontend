import React, { useState, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import { X, Crop, Image as ImageIcon } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";
import { Slider } from "@mui/material";
import axiosClient from "../../../shared/api/axiosClient";

interface BookFormProps {
  initialData?: BookFormData;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
}

interface BookFormData {
  id?: number;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  isbn?: string;
  call_number?: string;
  language_code?: string;
  format?: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  total_copies: number;
}

const MAX_TITLE_LENGTH = 80;
const CATEGORIES = [
  "Văn học",
  "Khoa học",
  "Công nghệ",
  "Lịch sử",
  "Triết học",
  "Kinh tế",
  "Nghệ thuật",
  "Khác",
];

const FORMATS = [
  { value: "HARDCOVER", label: "Bìa cứng" },
  { value: "PAPERBACK", label: "Bìa mềm" },
  { value: "EBOOK", label: "Sách điện tử" },
  { value: "AUDIOBOOK", label: "Sách nói" },
];

const LANGUAGES = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "Tiếng Anh" },
  { value: "fr", label: "Tiếng Pháp" },
  { value: "zh", label: "Tiếng Trung" },
  { value: "ja", label: "Tiếng Nhật" },
  { value: "ko", label: "Tiếng Hàn" },
  { value: "other", label: "Khác" },
];

export default function BookForm({
  initialData,
  onSubmit,
  onCancel,
}: BookFormProps): React.ReactElement {
  const [formData, setFormData] = useState<BookFormData>(() => {
    if (initialData) {
      return {
        id: initialData.id,
        title: initialData.title || "",
        author: initialData.author || "",
        publisher: initialData.publisher || "",
        publication_year:
          initialData.publication_year || new Date().getFullYear(),
        category: initialData.category || "",
        isbn: initialData.isbn || "",
        call_number: initialData.call_number || "",
        language_code: initialData.language_code || "vi",
        format: initialData.format || "PAPERBACK",
        description: initialData.description || "",
        thumbnail_url: initialData.thumbnail_url || "",
        total_copies: initialData.total_copies || 1,
      };
    }
    return {
      title: "",
      author: "",
      publisher: "",
      publication_year: new Date().getFullYear(),
      category: "",
      description: "",
      total_copies: 1,
      isbn: "",
      call_number: "",
      language_code: "vi",
      format: "PAPERBACK",
      thumbnail_url: "",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialData?.thumbnail_url || ""
  );
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleChange = (field: keyof BookFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // upload
  const handleCropConfirm = useCallback(async () => {
    if (!croppedAreaPixels || !imageToCrop) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageToCrop;
    await new Promise((res, rej) => {
      image.onload = () => res(null);
      image.onerror = rej;
    });

    const canvas = document.createElement("canvas");
    const exportWidth = 400;
    const exportHeight = 600;
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const sx = croppedAreaPixels.x * scaleX;
    const sy = croppedAreaPixels.y * scaleY;
    const sWidth = croppedAreaPixels.width * scaleX;
    const sHeight = croppedAreaPixels.height * scaleY;

    ctx.drawImage(
      image,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      exportWidth,
      exportHeight
    );

    // convert
    setUploadingThumbnail(true);
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/webp", 0.85);
      });

      const uploadFormData = new FormData();
      uploadFormData.append("thumbnail", blob, "thumbnail.webp");

      const response = await axiosClient.post<{
        success: boolean;
        data: { url: string };
      }>("/books/upload/thumbnail", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const cloudinaryUrl = response.data.data.url;
      setThumbnailPreview(cloudinaryUrl);
      setFormData((prev) => ({ ...prev, thumbnail_url: cloudinaryUrl }));
      setCropDialogOpen(false);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (error) {
      console.error("Upload thumbnail error:", error);
      alert("Lỗi khi upload ảnh bìa");
    } finally {
      setUploadingThumbnail(false);
    }
  }, [croppedAreaPixels, imageToCrop]);

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tên sách không được để trống";
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Tên sách không nên quá ${MAX_TITLE_LENGTH} ký tự`;
    }

    if (!formData.author.trim()) {
      newErrors.author = "Tác giả không được để trống";
    }

    if (!formData.publisher.trim()) {
      newErrors.publisher = "Nhà xuất bản không được để trống";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    if (formData.total_copies < 1) {
      newErrors.total_copies = "Số lượng phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const titleLengthColor =
    formData.title.length > MAX_TITLE_LENGTH
      ? "error"
      : formData.title.length > MAX_TITLE_LENGTH * 0.8
      ? "warning"
      : "success";

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Ảnh bìa (sẽ được cắt thành 2:3)
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "grey.50",
                cursor: uploadingThumbnail ? "not-allowed" : "pointer",
                "&:hover": {
                  bgcolor: uploadingThumbnail ? "grey.50" : "grey.100",
                },
              }}
              onClick={() => {
                if (!uploadingThumbnail) {
                  document.getElementById("thumbnail-input")?.click();
                }
              }}
            >
              {uploadingThumbnail ? (
                <Box sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Đang upload...
                  </Typography>
                </Box>
              ) : thumbnailPreview ? (
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    sx={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      borderRadius: 1,
                      border: 1,
                      borderColor: "divider",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": { bgcolor: "error.light" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnailPreview("");
                      setFormData((prev) => ({ ...prev, thumbnail_url: "" }));
                    }}
                  >
                    <X size={18} />
                  </IconButton>
                  <Button
                    size="small"
                    startIcon={<Crop size={16} />}
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "background.paper",
                      boxShadow: 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (thumbnailPreview) {
                        setImageToCrop(thumbnailPreview);
                        setCropDialogOpen(true);
                      }
                    }}
                  >
                    Cắt lại
                  </Button>
                </Box>
              ) : (
                <Box sx={{ py: 4 }}>
                  <ImageIcon size={48} style={{ opacity: 0.5 }} />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                    Nhấn để chọn ảnh bìa
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tỷ lệ tối ưu: 2:3 (400x600px)
                  </Typography>
                </Box>
              )}
              <input
                type="file"
                id="thumbnail-input"
                hidden
                accept="image/*"
                onChange={handleThumbnailSelect}
                disabled={uploadingThumbnail}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <Box>
                <TextField
                  fullWidth
                  label="Tên sách"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  error={!!errors.title}
                  helperText={
                    errors.title || (
                      <Typography
                        variant="caption"
                        color={titleLengthColor}
                        component="span"
                      >
                        {formData.title.length}/{MAX_TITLE_LENGTH} ký tự
                        {formData.title.length > MAX_TITLE_LENGTH * 0.8 &&
                          " (Nên rút ngắn để tránh bị cắt khi hiển thị)"}
                      </Typography>
                    )
                  }
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Tác giả"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                error={!!errors.author}
                helperText={errors.author}
                required
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Nhà xuất bản"
                    value={formData.publisher}
                    onChange={(e) => handleChange("publisher", e.target.value)}
                    error={!!errors.publisher}
                    helperText={errors.publisher}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Năm xuất bản"
                    type="number"
                    value={formData.publication_year}
                    onChange={(e) =>
                      handleChange("publication_year", parseInt(e.target.value))
                    }
                    required
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      label="Danh mục"
                    >
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số lượng bản sao"
                    type="number"
                    value={formData.total_copies}
                    onChange={(e) =>
                      handleChange("total_copies", parseInt(e.target.value))
                    }
                    error={!!errors.total_copies}
                    helperText={errors.total_copies}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="ISBN (tùy chọn)"
                    value={formData.isbn || ""}
                    onChange={(e) => handleChange("isbn", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Mã kho (Call Number)"
                    value={formData.call_number || ""}
                    onChange={(e) =>
                      handleChange("call_number", e.target.value)
                    }
                    placeholder="VD: 005.1 NGU"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Ngôn ngữ</InputLabel>
                    <Select
                      value={formData.language_code || "vi"}
                      onChange={(e) =>
                        handleChange("language_code", e.target.value)
                      }
                      label="Ngôn ngữ"
                    >
                      {LANGUAGES.map((lang) => (
                        <MenuItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Định dạng</InputLabel>
                    <Select
                      value={formData.format || "PAPERBACK"}
                      onChange={(e) => handleChange("format", e.target.value)}
                      label="Định dạng"
                    >
                      {FORMATS.map((fmt) => (
                        <MenuItem key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onCancel} disabled={submitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || uploadingThumbnail}
              >
                {submitting
                  ? "Đang lưu..."
                  : initialData
                  ? "Cập nhật"
                  : "Thêm sách"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={cropDialogOpen}
        onClose={() => {
          if (!uploadingThumbnail) {
            setCropDialogOpen(false);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Cắt ảnh bìa (tỷ lệ 2:3)
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 400,
              bgcolor: "grey.900",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={2 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            )}
          </Box>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Zoom
              </Typography>
              <Slider
                value={zoom}
                min={0.5}
                max={3}
                step={0.01}
                onChange={(_, value) => setZoom(value as number)}
                disabled={uploadingThumbnail}
              />
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={() => {
                  setCropDialogOpen(false);
                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                }}
                disabled={uploadingThumbnail}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={handleCropConfirm}
                disabled={uploadingThumbnail}
              >
                {uploadingThumbnail ? "Đang upload..." : "Xác nhận"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
