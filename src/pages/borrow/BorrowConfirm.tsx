import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { FileSignature, CheckCircle, AlertCircle } from "lucide-react";
import {
  borrowApi,
  BorrowPreviewData,
} from "../../features/borrow/api/borrow.api";
import { parseApiError } from "../../shared/lib/errorHandler";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BorrowConfirm(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [borrow, setBorrow] = useState<BorrowPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Phiếu mượn không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchBorrow = async () => {
      try {
        const response = await borrowApi.getBorrowPreview(Number(id));
        if (response.success && response.data) {
          setBorrow(response.data);
        } else {
          setError("Không thể tải thông tin phiếu mượn");
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBorrow();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signature.trim()) {
      setError("Vui lòng nhập họ tên của bạn để xác nhận");
      return;
    }

    if (!agreed) {
      setError("Vui lòng đồng ý với các điều khoản mượn sách");
      return;
    }

    if (!id || !borrow) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await borrowApi.confirmBorrow(Number(id), signature);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/user/profile", { state: { tab: 1 } });
        }, 2000);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !borrow) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: "center", backgroundColor: "transparent" }}
        >
          <CheckCircle
            size={64}
            color={theme.palette.success.main}
            style={{ marginBottom: 16 }}
          />
          <Typography variant="h5" gutterBottom>
            Xác nhận mượn sách thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Vui lòng đến thư viện để nhận sách trong vòng 3 ngày.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đang chuyển hướng...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!borrow) return <Box />;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <FileSignature size={32} />
                Phiếu Mượn Sách
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vui lòng xem xét kỹ thông tin và ký xác nhận bên dưới
              </Typography>
            </Box>

            <Divider />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thông tin người mượn
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Họ tên
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {borrow.fullname}
                        </Typography>
                      </Box>
                      {borrow.student_id && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Mã sinh viên
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {borrow.student_id}
                          </Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {borrow.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thông tin mượn sách
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Mã phiếu mượn
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          BRW-{String(borrow.id).padStart(6, "0")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày mượn
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {format(new Date(borrow.borrow_date), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Hạn trả
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="primary"
                        >
                          {format(new Date(borrow.due_date), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="h6" gutterBottom>
                Danh sách sách mượn
              </Typography>
              <Stack spacing={2}>
                {borrow.items?.map((item, index) => (
                  <Card key={item.copy_id} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        {item.thumbnail_url && (
                          <Grid size={{ xs: 3, sm: 2 }}>
                            <Box
                              component="img"
                              src={item.thumbnail_url}
                              alt={item.book_title}
                              sx={{
                                width: "100%",
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 1,
                              }}
                            />
                          </Grid>
                        )}
                        <Grid
                          size={{
                            xs: item.thumbnail_url ? 9 : 12,
                            sm: item.thumbnail_url ? 10 : 12,
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {index + 1}. {item.book_title}
                          </Typography>
                          {item.isbn && (
                            <Typography variant="body2" color="text.secondary">
                              ISBN: {item.isbn}
                            </Typography>
                          )}
                          {item.barcode && (
                            <Typography variant="body2" color="text.secondary">
                              Mã bản sao: {item.barcode}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Alert severity="info" icon={<AlertCircle />}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Điều khoản mượn sách
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>
                    Vui lòng đến thư viện trong vòng 3 ngày để nhận sách. Quá
                    hạn sẽ tự động hủy phiếu mượn.
                  </li>
                  <li>
                    Thời gian mượn: 14 ngày kể từ ngày nhận sách tại thư viện.
                  </li>
                  <li>
                    Giữ gìn sách sạch sẽ, không làm hư hỏng, rách, mất trang.
                  </li>
                  <li>Trả sách đúng hạn. Trễ hạn sẽ bị phạt theo quy định.</li>
                  <li>
                    Nếu làm mất hoặc hư hỏng sách, phải đền bù theo quy định.
                  </li>
                </ul>
              </Typography>
            </Alert>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Họ tên (Chữ ký)"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  fullWidth
                  required
                  placeholder="Nhập họ tên đầy đủ của bạn"
                  disabled={submitting}
                  helperText="Vui lòng nhập đúng họ tên của bạn để xác nhận"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      disabled={submitting}
                    />
                  }
                  label="Tôi đã đọc và đồng ý với các điều khoản mượn sách"
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                    fullWidth={isMobile}
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!signature.trim() || !agreed || submitting}
                    fullWidth={isMobile}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={20} />
                      ) : (
                        <FileSignature size={20} />
                      )
                    }
                  >
                    {submitting ? "Đang xử lý..." : "Xác nhận mượn sách"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
