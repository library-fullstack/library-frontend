import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Link,
  Card,
  CardContent,
} from "@mui/material";
import SeoMetaTags from "../../shared/components/SeoMetaTags";
import Footer from "../../shared/ui/Footer";
import useAuth from "../../features/auth/hooks/useAuth";

export default function Contact(): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setSubmitStatus("error");
      return;
    }

    if (feedback.trim()) {
      setSubmitStatus("success");
      setFeedback("");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const locations = [
    {
      name: "Minh Khai",
      address: "Tầng 1 - HA5 - 419/17/16 Minh Khai",
      district: "P. Vĩnh Tuy, TP. Hà Nội",
      staff: "Cô Mai Thị Trang",
      phone: "0364.685.503",
    },
    {
      name: "Lĩnh Nam",
      address: "Tầng 2 - HA10 - 419/17/16 Lĩnh Nam",
      district: "P. Hoàng Mai, TP. Hà Nội",
      staff: "Cô Phan Thị Thư",
      phone: "0973.105.669",
    },
    {
      name: "Nam Định",
      address: "Tòa nhà Thư viện - 419/17/16 Trần Hưng Đạo",
      district: "P. Nam Định, Tỉnh Ninh Bình",
      staff: "Cô Đỗ Thị Vân Hoài",
      phone: "0945.579.624",
    },
  ];

  return (
    <>
      <SeoMetaTags
        title="Liên hệ - Thư viện HBH"
        description="Thông tin liên hệ Trung tâm Thư viện Trường Đại học HBH"
        keywords="liên hệ, thư viện HBH, địa chỉ, số điện thoại"
      />

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: { xs: 6, md: 8 },
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Liên hệ
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 700 }}>
              Trung tâm Thư viện Trường Đại học HBH
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Địa điểm liên hệ
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {locations.map((location) => (
                    <Grid size={12} key={location.name}>
                      <Card
                        variant="outlined"
                        sx={{
                          bgcolor: "background.default",
                          borderColor: "divider",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                            gutterBottom
                          >
                            {location.name}
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>Địa chỉ:</strong> {location.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {location.district}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Cán bộ hỗ trợ:</strong> {location.staff}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Số điện thoại:</strong>{" "}
                              <Link
                                href={`tel:${location.phone.replace(
                                  /\./g,
                                  ""
                                )}`}
                                color="primary"
                              >
                                {location.phone}
                              </Link>
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Ý kiến phản hồi
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Các ý kiến đề xuất của bạn sẽ giúp cải thiện dịch vụ của chúng
                  tôi.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {!isAuthenticated && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Bạn phải đăng nhập để sử dụng tính năng này
                  </Alert>
                )}

                {submitStatus === "success" && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Cảm ơn bạn đã gửi ý kiến! Chúng tôi sẽ xem xét và phản hồi
                    sớm nhất.
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    Vui lòng đăng nhập để gửi ý kiến phản hồi.
                  </Alert>
                )}

                <form onSubmit={handleSubmitFeedback}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Viết ý kiến của bạn ở đây..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={!isAuthenticated}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!isAuthenticated || !feedback.trim()}
                    sx={{ minWidth: 150 }}
                  >
                    Gửi ý kiến
                  </Button>
                </form>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Kênh thông tin
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Website
                    </Typography>
                    <Link
                      href="https://hbh.libsys.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      https://hbh.libsys.me
                    </Link>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Email
                    </Typography>
                    <Link
                      href="mailto:thuvien@hbh.libsys.me"
                      color="primary"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      thuvien@hbh.libsys.me
                    </Link>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Fanpage
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thư viện Trường Đại học HBH
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Biểu mẫu
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Phiếu yêu cầu bổ sung tài liệu
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      paragraph
                    >
                      Đề xuất sách, tài liệu mới cho thư viện
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={!isAuthenticated}
                      sx={{ mt: 1 }}
                    >
                      Tải biểu mẫu
                    </Button>
                  </Box>

                  {!isAuthenticated && (
                    <Alert
                      severity="info"
                      sx={{ fontSize: "0.75rem", py: 0.5 }}
                    >
                      Đăng nhập để tải biểu mẫu
                    </Alert>
                  )}
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  mt: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Thời gian phục vụ
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Minh Khai & Lĩnh Nam
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Thứ 2 - Thứ 6 (trừ ngày lễ, Tết)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Sáng: 08:00 - 12:00
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Chiều: 13:00 - 17:00
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Nam Định
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Thứ 2 - Thứ 6 (trừ ngày lễ, Tết)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Sáng: 07:30 - 11:30
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Chiều: 13:00 - 17:00
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
