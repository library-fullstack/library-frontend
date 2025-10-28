import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Slider,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import Cropper, { Area } from "react-easy-crop";

interface AvatarCropDialogProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onConfirm: (blob: Blob) => void;
}

export default function AvatarCropDialog({
  open,
  imageSrc,
  onClose,
  onConfirm,
}: AvatarCropDialogProps): React.ReactElement {
  const theme = useTheme();
  const [zoom, setZoom] = React.useState(1);
  const [crop, setCrop] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = React.useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function createCroppedBlob(): Promise<Blob | null> {
    if (!croppedAreaPixels) return null;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    await new Promise((res, rej) => {
      image.onload = () => res(null);
      image.onerror = rej;
    });

    const canvas = document.createElement("canvas");
    // xuất avatar vuông 512x512
    const exportSize = 512;
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const sx = croppedAreaPixels.x * scaleX;
    const sy = croppedAreaPixels.y * scaleY;
    const sWidth = croppedAreaPixels.width * scaleX;
    const sHeight = croppedAreaPixels.height * scaleY;

    // vẽ vào canvas đích, bo tròn (hình tròn) để xem trước đẹp hơn
    ctx.clearRect(0, 0, exportSize, exportSize);
    ctx.save();
    ctx.beginPath();
    ctx.arc(exportSize / 2, exportSize / 2, exportSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, exportSize, exportSize);
    ctx.restore();

    return await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/webp", 0.85)
    );
  }

  const handleConfirm = async () => {
    const blob = await createCroppedBlob();
    if (blob) onConfirm(blob);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa ảnh đại diện</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 360,
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="cover"
            />
          )}
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Box sx={{ width: "100%", px: 1 }}>
            <Slider
              min={0.5}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(_, v) => setZoom(v as number)}
              aria-label="Zoom"
            />
          </Box>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{ textTransform: "none" }}
          >
            Lưu
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
