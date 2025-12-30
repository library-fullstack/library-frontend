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
  useEventDetail,
  useCreateEvent,
  useUpdateEvent,
} from "../../../features/events/hooks/useEventsQuery";
import { EventStatus } from "../../../shared/types/events.types";
import { useSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import ImageUploadField from "../../../shared/components/ImageUploadField";
import { uploadApi } from "../api/upload.api";

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingId: number | null;
}

interface FormData {
  title: string;
  description: string;
  location: string;
  start_time: Date | null;
  end_time: Date | null;
  status: EventStatus;
  thumbnail_url: string;
  send_email?: boolean;
}

export default function EventFormDialog({
  open,
  onClose,
  editingId,
}: EventFormDialogProps) {
  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      start_time: null,
      end_time: null,
      status: EventStatus.UPCOMING,
      thumbnail_url: "",
      send_email: false,
    },
  });

  const { data: event } = useEventDetail(editingId || 0);
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (event && editingId) {
      setValue("title", event.title);
      setValue("description", event.description || "");
      setValue("location", event.location || "");
      setValue("start_time", new Date(event.start_time));
      setValue("end_time", new Date(event.end_time));
      setValue("status", event.status);
      setValue("thumbnail_url", event.thumbnail_url || "");
    } else {
      reset();
    }
  }, [event, editingId, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        ...data,
        start_time: data.start_time ? data.start_time.toISOString() : "",
        end_time: data.end_time ? data.end_time.toISOString() : "",
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: submitData });
        enqueueSnackbar("Cập nhật sự kiện thành công", { variant: "success" });
      } else {
        await createMutation.mutateAsync(submitData);
        enqueueSnackbar("Tạo sự kiện thành công", { variant: "success" });
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
        {editingId ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
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
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={4}
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Địa điểm" fullWidth />
              )}
            />

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={vi}
            >
              <Controller
                name="start_time"
                control={control}
                rules={{ required: "Vui lòng chọn thời gian bắt đầu" }}
                render={({ field, fieldState }) => (
                  <DateTimePicker
                    {...field}
                    label="Thời gian bắt đầu"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="end_time"
                control={control}
                rules={{ required: "Vui lòng chọn thời gian kết thúc" }}
                render={({ field, fieldState }) => (
                  <DateTimePicker
                    {...field}
                    label="Thời gian kết thúc"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select {...field} label="Trạng thái">
                    <MenuItem value={EventStatus.UPCOMING}>
                      Sắp diễn ra
                    </MenuItem>
                    <MenuItem value={EventStatus.ONGOING}>
                      Đang diễn ra
                    </MenuItem>
                    <MenuItem value={EventStatus.COMPLETED}>
                      Đã kết thúc
                    </MenuItem>
                    <MenuItem value={EventStatus.CANCELLED}>Đã hủy</MenuItem>
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
                  onUpload={(file) => uploadApi.uploadImage(file, "events")}
                  label="Ảnh thumbnail"
                  helperText="Upload ảnh hoặc nhập URL"
                  error={!!fieldState.error}
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
