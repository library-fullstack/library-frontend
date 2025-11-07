import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormLabel,
  Stack,
  LinearProgress,
  Switch,
} from "@mui/material";
import {
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Plus as PlusIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  X as XIcon,
} from "lucide-react";
import { bannerApi, BannerData } from "../../features/admin/api/banner.api";
import { settingsApi } from "../../features/admin/api/settings.api";
import { parseApiError } from "../../shared/lib/errorHandler";
import { DebouncedColorPicker } from "../../shared/components/DebouncedColorPicker";
import StorageUtil from "../../shared/lib/storage";
import logger from "@/shared/lib/logger";

interface FormDataState extends BannerData {
  id?: string;
}

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [eventEffectsEnabled, setEventEffectsEnabled] = useState(true);
  const [loadingEffectsSetting, setLoadingEffectsSetting] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    id: undefined,
    image: "",
    overlay: "dark",
    title: "",
    subtitle: "",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.9)",
    buttonColor: "#ED553B",
    buttonText: "Xem thêm",
    eventType: "DEFAULT",
    startDate: "",
    endDate: "",
    isActive: false,
  });

  useEffect(() => {
    loadBanners();
    loadEventEffectsSetting();
  }, []);

  const loadEventEffectsSetting = async () => {
    try {
      setLoadingEffectsSetting(true);
      const setting = await settingsApi.getSetting("disable_event_effects");
      if (setting) {
        try {
          const isDisabled = JSON.parse(setting.setting_value) as boolean;
          setEventEffectsEnabled(!isDisabled);
        } catch (parseErr) {
          logger.error("Failed to parse event effects setting:", parseErr);
          setEventEffectsEnabled(true);
        }
      } else {
        setEventEffectsEnabled(true);
      }
    } catch (err) {
      logger.error("Error loading event effects setting:", err);
      setEventEffectsEnabled(true);
    } finally {
      setLoadingEffectsSetting(false);
    }
  };

  const loadBanners = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await bannerApi.getAllBanners();
      setBanners(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (banner?: BannerData) => {
    if (banner) {
      const formatDateForInput = (date: unknown): string => {
        if (date instanceof Date) {
          return date.toISOString().split("T")[0];
        }
        if (typeof date === "string") {
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
          }
          if (/^\d{4}-\d{2}-\d{2}T/.test(date)) {
            return date.split("T")[0];
          }
        }
        return "";
      };

      setEditingId(banner.id || null);
      setFormData({
        id: banner.id,
        image: banner.image,
        overlay: banner.overlay,
        title: banner.title,
        subtitle: banner.subtitle,
        titleColor: banner.titleColor,
        subtitleColor: banner.subtitleColor,
        buttonColor: banner.buttonColor,
        buttonText: banner.buttonText,
        eventType: banner.eventType,
        startDate: formatDateForInput(banner.startDate),
        endDate: formatDateForInput(banner.endDate),
        isActive: banner.isActive,
      });
      setImagePreview(banner.image);
    } else {
      setEditingId(null);
      setFormData({
        id: undefined,
        image: "",
        overlay: "dark",
        title: "",
        subtitle: "",
        titleColor: "#ffffff",
        subtitleColor: "rgba(255,255,255,0.9)",
        buttonColor: "#ED553B",
        buttonText: "Xem thêm",
        eventType: "DEFAULT",
        startDate: "",
        endDate: "",
        isActive: false,
      });
      setImagePreview("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setImagePreview("");
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await bannerApi.uploadBannerImage(file);
      setFormData((prev) => ({
        ...prev,
        image: url,
      }));
      setImagePreview(url);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setUploading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { name: string; value: string } }
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleColorChange = useCallback((name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.subtitle || !formData.image) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const dataToSave = {
        image: formData.image,
        overlay: formData.overlay as "dark" | "light",
        title: formData.title,
        subtitle: formData.subtitle,
        titleColor: formData.titleColor,
        subtitleColor: formData.subtitleColor,
        buttonColor: formData.buttonColor,
        buttonText: formData.buttonText,
        eventType: formData.eventType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      };

      if (editingId) {
        await bannerApi.updateBanner(editingId, dataToSave);
      } else {
        await bannerApi.createBanner(dataToSave);
      }
      setOpenDialog(false);
      loadBanners();

      const bc = new BroadcastChannel("banner-sync");
      logger.log("[BannerManagement] Đang phát tín hiệu REFRESH_BANNER");
      bc.postMessage("REFRESH_BANNER");
      bc.close();
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      try {
        await bannerApi.deleteBanner(id);
        loadBanners();

        const bc = new BroadcastChannel("banner-sync");
        logger.log(
          "[BannerManagement] Đang phát tín hiệu REFRESH_BANNER (xoá)"
        );
        bc.postMessage("REFRESH_BANNER");
        bc.close();
      } catch (err) {
        setError(parseApiError(err));
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await bannerApi.toggleBannerStatus(id, !currentStatus);
      loadBanners();

      const bc = new BroadcastChannel("banner-sync");
      logger.log(
        "[BannerManagement] Đang phát tín hiệu REFRESH_BANNER (toggle)"
      );
      bc.postMessage("REFRESH_BANNER");
      bc.close();
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const handleToggleEventEffects = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const isEnabled = event.target.checked;
      setEventEffectsEnabled(isEnabled);
      setLoadingEffectsSetting(true);

      await settingsApi.updateSetting(
        "disable_event_effects",
        JSON.stringify(!isEnabled),
        "Event effects toggle"
      );

      StorageUtil.setItem("disable_event_effects", JSON.stringify(!isEnabled));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setError(parseApiError(err));
      setEventEffectsEnabled(!event.target.checked);
    } finally {
      setLoadingEffectsSetting(false);
    }
  };

  const eventTypes = [
    { value: "DEFAULT", label: "Mặc định" },
    { value: "HALLOWEEN", label: "Halloween" },
    { value: "CHRISTMAS", label: "Giáng Sinh" },
    { value: "TET", label: "Tết" },
    { value: "NEWYEAR", label: "Năm mới" },
    { value: "VALENTINE", label: "Valentine" },
    { value: "SPRING", label: "Mùa Xuân" },
    { value: "SUMMER", label: "Hè" },
    { value: "BACKTOSCHOOL", label: "Quay lại trường" },
    { value: "BLACKFRIDAY", label: "Black Friday" },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{}}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Quản lý Banner
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo, chỉnh sửa và quản lý các banner sự kiện cho trang chủ
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 1.5, sm: 2 },
                py: 1,
                bgcolor: "action.hover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                minWidth: "auto",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Hiệu ứng sự kiện:
              </Typography>
              <Switch
                checked={eventEffectsEnabled}
                onChange={handleToggleEventEffects}
                disabled={loadingEffectsSetting}
                size="small"
              />
              <Typography
                variant="caption"
                sx={{
                  color: eventEffectsEnabled
                    ? "success.main"
                    : "text.secondary",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                {loadingEffectsSetting
                  ? "..."
                  : eventEffectsEnabled
                  ? "Bật"
                  : "Tắt"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon size={20} />}
              onClick={() => handleOpenDialog()}
              sx={{
                alignSelf: { xs: "stretch", sm: "auto" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Tạo Banner Mới
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{ border: "1px solid", borderColor: "divider" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  whiteSpace: "nowrap",
                }}
              >
                Tiêu đề
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  whiteSpace: "nowrap",
                }}
              >
                Sự kiện
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  whiteSpace: "nowrap",
                }}
              >
                Ngày bắt đầu
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  whiteSpace: "nowrap",
                }}
              >
                Ngày kết thúc
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    Không có banner nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow
                  key={banner.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    opacity: banner.isActive ? 1 : 0.6,
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          maxWidth: { xs: 300, sm: "auto" },
                        }}
                      >
                        {banner.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: 200, sm: "auto" },
                          display: "block",
                        }}
                      >
                        {banner.subtitle}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    <Chip
                      label={
                        eventTypes.find((et) => et.value === banner.eventType)
                          ?.label || banner.eventType
                      }
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    <Typography variant="body2">
                      {new Date(banner.startDate!).toLocaleDateString("vi-VN")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    <Typography variant="body2">
                      {new Date(banner.endDate!).toLocaleDateString("vi-VN")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                      label={banner.isActive ? "Hoạt động" : "Không hoạt động"}
                      color={banner.isActive ? "success" : "default"}
                      size="small"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleToggleStatus(banner.id!, banner.isActive!)
                      }
                      title={banner.isActive ? "Ẩn banner" : "Hiển thị banner"}
                    >
                      {banner.isActive ? (
                        <EyeIcon size={18} />
                      ) : (
                        <EyeOffIcon size={18} />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(banner)}
                    >
                      <EditIcon size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(banner.id!)}
                    >
                      <DeleteIcon size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <BannerFormDialog
        open={openDialog}
        editingId={editingId}
        formData={formData}
        imagePreview={imagePreview}
        uploading={uploading}
        eventTypes={eventTypes}
        onClose={handleCloseDialog}
        onInputChange={handleInputChange}
        onColorChange={handleColorChange}
        onFileUpload={handleFileUpload}
        onRemoveImage={() => {
          setFormData((prev) => ({ ...prev, image: "" }));
          setImagePreview("");
        }}
        onSave={handleSave}
      />
    </Box>
  );
};

interface BannerFormDialogProps {
  open: boolean;
  editingId: string | null;
  formData: FormDataState;
  imagePreview: string;
  uploading: boolean;
  eventTypes: Array<{ value: string; label: string }>;
  onClose: () => void;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => void;
  onColorChange: (name: string) => (value: string) => void;
  onFileUpload: (file: File) => void;
  onRemoveImage: () => void;
  onSave: () => void;
}

const BannerFormDialog = React.memo(function BannerFormDialog({
  open,
  editingId,
  formData,
  imagePreview,
  uploading,
  eventTypes,
  onClose,
  onInputChange,
  onColorChange,
  onFileUpload,
  onRemoveImage,
  onSave,
}: BannerFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          pb: { xs: 2, sm: 2.5 },
          letterSpacing: "0.3px",
        }}
      >
        {editingId ? "Chỉnh sửa Banner" : "Tạo Banner Mới"}
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 5, sm: 3 } }}>
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Tiêu đề
            </Typography>
            <TextField
              name="title"
              fullWidth
              size="small"
              value={formData.title}
              onChange={onInputChange}
              sx={{
                "& .MuiOutlinedInput-input": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Tiêu đề phụ
            </Typography>
            <TextField
              name="subtitle"
              fullWidth
              multiline
              rows={2}
              value={formData.subtitle}
              onChange={onInputChange}
            />
          </Box>
          <Box>
            <FormLabel sx={{ display: "block", mb: 1 }}>
              Hình ảnh Banner
            </FormLabel>
            {imagePreview && (
              <Box
                sx={{
                  mb: 2,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 1,
                  bgcolor: "action.hover",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadIcon size={18} />}
                sx={{ flex: 1 }}
                disabled={uploading}
              >
                {uploading ? "Đang tải..." : "Chọn ảnh"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileUpload(file);
                  }}
                  disabled={uploading}
                />
              </Button>
              {imagePreview && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<XIcon size={18} />}
                  onClick={onRemoveImage}
                >
                  Xóa
                </Button>
              )}
            </Box>
            {uploading && <LinearProgress sx={{ mt: 1 }} />}
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Hoặc dán đường dẫn ảnh
            </Typography>
            <TextField
              name="image"
              fullWidth
              size="small"
              value={formData.image}
              onChange={onInputChange}
              placeholder="https://example.com/image.webp"
              helperText="Nếu tải file, trường này sẽ tự động cập nhật"
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Văn bản nút
            </Typography>
            <TextField
              name="buttonText"
              fullWidth
              size="small"
              value={formData.buttonText}
              onChange={onInputChange}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Sự kiện
            </Typography>
            <Select
              name="eventType"
              value={formData.eventType || "DEFAULT"}
              onChange={onInputChange}
              fullWidth
              size="small"
            >
              {eventTypes.map((et) => (
                <MenuItem key={et.value} value={et.value}>
                  {et.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Kiểu overlay
            </Typography>
            <Select
              name="overlay"
              value={formData.overlay}
              onChange={onInputChange}
              fullWidth
              size="small"
            >
              <MenuItem value="dark">Tối</MenuItem>
              <MenuItem value="light">Sáng</MenuItem>
            </Select>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Màu tiêu đề
              </Typography>
              <DebouncedColorPicker
                name="titleColor"
                fullWidth
                size="small"
                value={formData.titleColor}
                onChange={onColorChange("titleColor")}
                debounceMs={100}
                slotProps={{
                  htmlInput: { style: { cursor: "pointer", height: 40 } }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Màu nút
              </Typography>
              <DebouncedColorPicker
                name="buttonColor"
                fullWidth
                size="small"
                value={formData.buttonColor}
                onChange={onColorChange("buttonColor")}
                debounceMs={100}
                slotProps={{
                  htmlInput: { style: { cursor: "pointer", height: 40 } }
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Màu tiêu đề phụ
              </Typography>
              <DebouncedColorPicker
                name="subtitleColor"
                fullWidth
                size="small"
                value={formData.subtitleColor}
                onChange={onColorChange("subtitleColor")}
                debounceMs={100}
                slotProps={{
                  htmlInput: { style: { cursor: "pointer", height: 40 } }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Ngày bắt đầu
              </Typography>
              <TextField
                name="startDate"
                type="date"
                fullWidth
                size="small"
                value={formData.startDate || ""}
                onChange={onInputChange}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Ngày kết thúc
              </Typography>
              <TextField
                name="endDate"
                type="date"
                fullWidth
                size="small"
                value={formData.endDate || ""}
                onChange={onInputChange}
              />
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          gap: { xs: 1.5, sm: 1.5 },
          p: { xs: 2, sm: 2.5 },
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: 500,
            minWidth: { xs: 80, sm: "auto" },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          startIcon={<SaveIcon size={18} />}
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: 600,
            minWidth: { xs: 100, sm: "auto" },
            mr: { xs: 1 },
          }}
        >
          {editingId ? "Cập nhật" : "Tạo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default BannerManagement;
