import * as React from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Switch,
  useTheme,
  Stack,
} from "@mui/material";
import { LogoutOutlined, BadgeOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile(): React.ReactElement {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);

  const chipBg = theme.palette.mode === "dark" ? "#4F46E5" : "#6366F1";
  const logoutBg = theme.palette.mode === "dark" ? "#7F1D1D" : "#FEE2E2";
  const logoutColor = theme.palette.mode === "dark" ? "#FECACA" : "#991B1B";

  function handleLogout(): void {
    logout();
    navigate("/");
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: { xs: 2, sm: 3 },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                src={user?.avatar_url || ""}
                sx={{
                  width: { xs: 90, sm: 100 },
                  height: { xs: 90, sm: 100 },
                  fontSize: { xs: 36, sm: 40 },
                  fontWeight: 700,
                  bgcolor: "primary.main",
                }}
              >
                {user?.full_name?.charAt(0) || "?"}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {user?.full_name || "Chưa cập nhật"}
                </Typography>
                <Chip
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <BadgeOutlined
                        sx={{ fontSize: 18, position: "relative", top: "-2px" }}
                      />
                      <Typography sx={{ fontWeight: 700, color: "white" }}>
                        {user?.student_id || "Chưa có MSSV"}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mt: 1,
                    bgcolor: chipBg,
                    color: "white",
                    width: { xs: "auto", sm: 190 },
                    height: 32,
                    px: 1.25,
                  }}
                />
              </Box>
            </Box>

            <Button
              startIcon={<LogoutOutlined />}
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1,
                bgcolor: logoutBg,
                color: logoutColor,
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#991B1B" : "#FCA5A5",
                },
              }}
            >
              Đăng xuất
            </Button>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mt: 4,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                minHeight: 48,
                borderRadius: "12px 12px 0 0",
                px: 2.5,
                transition: "background-color 0.2s ease",
                fontSize: { xs: "0.85rem", sm: "0.875rem" },
                minWidth: { xs: "auto", sm: 90 },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
              "& .MuiTouchRipple-root": {
                overflow: "hidden",
                borderRadius: 12,
              },
              "& .MuiTouchRipple-child": {
                borderRadius: 12,
                backgroundColor: "rgba(99, 102, 241, 0.18)",
              },
              "& .MuiTabs-scrollButtons": {
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab label="Thông tin tài khoản" />
            <Tab label="Hoạt động" />
            <Tab label="Cài đặt tài khoản" />
            <Tab label="Cài đặt hệ thống" />
          </Tabs>

          {/* tab thông tin tài khoản */}
          <TabPanel value={tab} index={0}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Thông tin cá nhân
                </Typography>
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Họ tên:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.full_name || "Chưa cập nhật"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.email || "Chưa có email"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số điện thoại:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.phone || "Chưa có SĐT"}
                    </Typography>
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Thông tin học vấn
                </Typography>
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Lớp:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.class_name || "Chưa cập nhật"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khoa:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.faculty || "Chưa cập nhật"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chuyên ngành:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.major || "Chưa cập nhật"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Năm nhập học:{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={700}
                    >
                      {user?.admission_year || "Chưa cập nhật"}
                    </Typography>
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* bảng thống kê */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 3,
                mt: 3,
              }}
            >
              {[
                { label: "Sách đang mượn", value: 0 },
                { label: "Đã trả", value: 0 },
                { label: "Yêu thích", value: 0 },
              ].map((s) => (
                <Card
                  key={s.label}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    textAlign: "center",
                    transition: "all .2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ py: 3 }}>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      color="primary.main"
                    >
                      {s.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      mt={1}
                    >
                      {s.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>

          {/* tab hoạt động */}
          <TabPanel value={tab} index={1}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight={800} mb={2}>
                Hoạt động gần đây
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chưa có hoạt động nào gần đây.
              </Typography>
            </Paper>
          </TabPanel>

          {/* tab cài đặt tài khoản */}
          <TabPanel value={tab} index={2}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr" },
                gap: 3,
              }}
            >
              {/* thay đổi avatar */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  alignSelf="flex-start"
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Ảnh đại diện ( BETA )
                </Typography>
                <Avatar
                  src={user?.avatar_url || ""}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    fontSize: { xs: 40, sm: 48 },
                    fontWeight: 700,
                    bgcolor: "primary.main",
                    mb: 1,
                  }}
                >
                  {user?.full_name?.charAt(0) || "?"}
                </Avatar>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  }}
                >
                  Tải ảnh lên
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                >
                  Định dạng: JPG, PNG (tối đa 2MB)
                </Typography>
              </Paper>

              {/* thay đổi mật khẩu */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  mb={3}
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Đổi mật khẩu ( BETA )
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu hiện tại"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu mới"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Xác nhận mật khẩu mới"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1,
                      alignSelf: "flex-start",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Cập nhật mật khẩu
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </TabPanel>

          {/* tab cài đặt hệ thống */}
          <TabPanel value={tab} index={3}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Tùy chọn thông báo
                </Typography>
                <Stack spacing={1.5}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Nhận email khi sắp đến hạn trả sách ( BETA )
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Nhận email khi có sách mới ( BETA )
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Nhận thông báo về sự kiện thư viện ( BETA )
                      </Typography>
                    }
                  />
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Giao diện
                </Typography>
                <Stack spacing={1.5}>
                  <FormControlLabel
                    control={<Switch />}
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Chế độ thu gọn ( BETA )
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Hiển thị số lượng sách trong menu ( BETA )
                      </Typography>
                    }
                  />
                </Stack>
              </Paper>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
