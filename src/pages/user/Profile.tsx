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
  useMediaQuery,//Thêm import useMediaQuery để detect mobile
} from "@mui/material";
import { LogoutOutlined, BadgeOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); //Thêm biến detect mobile (< 900px)
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
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* header -  Layout mobile avatar bên trái */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "row" },  // Luôn row
              alignItems: { xs: "flex-start", md: "center" },//mobile align top,desktop center
              justifyContent: "space-between",
              gap: { xs: 2, md: 3 }, //gap nhỏ hơn trên mobile
            }}
          >
            {/* Avatar + Info */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: { xs: "flex-start", md: "center" },//mobile ảnh đại diện, msv ,tên cho lên trái
                gap: { xs: 2, md: 3 },
                flex: 1,// Cho phép co giãn để button logout không bị đẩy xuống
              }}
            >
              {/* avatar nhỏ hơn tren */}
              <Avatar
                src={user?.avatar_url || ""}
                sx={{
                  width: { xs: 64, md: 100 },  // Nhỏ hơn trên mobile
                  height: { xs: 64, md: 100 },
                  fontSize: { xs: 28, md: 40 },
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  flexShrink: 0,  // Không cho avatar co lại
                }}
              >
                {user?.full_name?.charAt(0) || "?"}
              </Avatar>
              
              <Box sx={{ minWidth: 0 }}>  {/* minWidth: 0 để text truncate hoạt động */}
                <Typography 
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight={800}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: { xs: "nowrap", md: "normal" },
                  }}
                >
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
                    width: { xs: "auto", md: 190 },
                    height: 32,
                    px: 1.25,
                  }}
                />
              </Box>
            </Box>

          
           {/* Logout Button */}
<Button
  startIcon={!isMobile ? <LogoutOutlined /> : undefined}  // ← SỬA: Chỉ hiện startIcon trên desktop
  onClick={handleLogout}
  sx={{
    borderRadius: 1,
    textTransform: "none",
    fontWeight: 700,
    px: { xs: 2, md: 3 },
    py: 1,
    bgcolor: logoutBg,
    color: logoutColor,
    flexShrink: 0,
    minWidth: { xs: "auto", md: "auto" },
    "&:hover": {
      bgcolor:
        theme.palette.mode === "dark" ? "#991B1B" : "#FCA5A5",
    },
  }}
>
  {isMobile ? <LogoutOutlined /> : "Đăng xuất"}  {/* ← SỬA: Mobile icon, Desktop text */}
</Button>

          </Box>

          {/* Tabs - Sửa responsive và scroll */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant={isMobile ? "scrollable" : "standard"}  // Scrollable trên mobile
            scrollButtons={isMobile ? "auto" : false}
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
                px: { xs: 2, md: 2.5 },
                fontSize: { xs: "0.875rem", md: "1rem" },
                minWidth: { xs: "auto", md: 160 },
                transition: "all 0.3s ease",  // Thêm transition
                "&:hover": {
                  bgcolor: "action.hover",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",  // Smooth transition
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
              "& .MuiTabs-scrollButtons": {
                "&.Mui-disabled": { display: "none" },
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
                  borderRadius: 1,
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
                  borderRadius: 1,
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
                    borderRadius: 1,
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
                borderRadius: 1,
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
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  alignSelf="flex-start"
                >
                  Ảnh đại diện ( BETA )
                </Typography>
                <Avatar
                  src={user?.avatar_url || ""}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
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
                  }}
                >
                  Tải ảnh lên
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                >
                  Định dạng: JPG, PNG (tối đa 2MB)
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={3}>
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
                  borderRadius: 1,
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
                  borderRadius: 1,
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
