import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  useNewsDetail,
  useCreateNews,
  useUpdateNews,
} from "../../../features/news/hooks/useNewsQuery";
import { NewsCategory, NewsStatus } from "../../../shared/types/news.types";
import { useSnackbar } from "notistack";
import ImageUploadField from "../../../shared/components/ImageUploadField";
import { uploadApi } from "../api/upload.api";

interface NewsFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingId: number | null;
}

interface FormData {
  title: string;
  content: string;
  category: NewsCategory;
  status: NewsStatus;
  thumbnail_url: string;
  send_email?: boolean;
}

export default function NewsFormDialog({
  open,
  onClose,
  editingId,
}: NewsFormDialogProps) {
  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      category: NewsCategory.ANNOUNCEMENT,
      status: NewsStatus.PUBLISHED,
      thumbnail_url: "",
      send_email: false,
    },
  });

  const { data: news } = useNewsDetail(editingId || 0);
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (news && editingId) {
      setValue("title", news.title);
      setValue("content", news.content);
      setValue("category", news.category);
      setValue("status", news.status);
      setValue("thumbnail_url", news.thumbnail_url || "");
    } else {
      reset();
    }
  }, [news, editingId, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data });
        enqueueSnackbar("Cập nhật tin tức thành công", { variant: "success" });
      } else {
        await createMutation.mutateAsync(data);
        enqueueSnackbar("Tạo tin tức thành công", { variant: "success" });
      }
      onClose();
      reset();
    } catch {
      enqueueSnackbar("Có lỗi xảy ra", { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingId ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Vui lòng nhập tiêu đề" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Tiêu đề"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Danh mục</InputLabel>
                  <Select {...field} label="Danh mục">
                    <MenuItem value={NewsCategory.ANNOUNCEMENT}>
                      Thông báo
                    </MenuItem>
                    <MenuItem value={NewsCategory.GUIDE}>Hướng dẫn</MenuItem>
                    <MenuItem value={NewsCategory.UPDATE}>Cập nhật</MenuItem>
                    <MenuItem value={NewsCategory.OTHER}>Khác</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select {...field} label="Trạng thái">
                    <MenuItem value={NewsStatus.DRAFT}>Nháp</MenuItem>
                    <MenuItem value={NewsStatus.PUBLISHED}>Xuất bản</MenuItem>
                    <MenuItem value={NewsStatus.ARCHIVED}>Lưu trữ</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="thumbnail_url"
              control={control}
              render={({ field, fieldState }) => (
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={(file) => uploadApi.uploadImage(file, "news")}
                  label="Ảnh thumbnail"
                  helperText="Upload ảnh hoặc nhập URL"
                  error={!!fieldState.error}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              rules={{ required: "Vui lòng nhập nội dung" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nội dung"
                  fullWidth
                  multiline
                  rows={10}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {!editingId && (
              <Controller
                name="send_email"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox {...field} checked={field.value || false} />
                    }
                    label="Gửi email thông báo cho sinh viên"
                  />
                )}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained">
            {editingId ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
