import * as React from "react";
import { Box, Typography, Button, Avatar, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuBar from "../../components/layout/MenuBar";
import Navbar from "../../components/layout/Navbar";

export default function Profile(): React.ReactElement {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // xử lí nút đăng xuất
  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth/login");
  }

  return (
    <>
      <Box sx={{ backgroundColor: "#FAFAFA" }}>
        <Navbar />
        <MenuBar />
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f9f9f9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "20px",
            minWidth: 400,
            textAlign: "center",
          }}
        >
          <Avatar
            src={user.avatar_url || ""}
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "#1976d2",
              fontSize: 28,
            }}
          >
            {user.full_name?.charAt(0) || "?"}
          </Avatar>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            {user.full_name || "Không rõ tên"}
          </Typography>

          <Typography color="text.secondary" mb={1}>
            {user.student_id || "không rõ"}
          </Typography>

          <Typography>Email: {user.email || "không rõ"}</Typography>
          <Typography>Số điện thoại: {user.phone || "không rõ"}</Typography>
          <Typography>Lớp: {user.class_name || "không rõ"}</Typography>
          <Typography>Khoa: {user.faculty || "không rõ"}</Typography>
          <Typography>Chuyên ngành: {user.major || "không rõ"}</Typography>
          <Typography>
            Năm nhập học: {user.admission_year || "không rõ"}
          </Typography>

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 3, borderRadius: "10px" }}
          >
            Đăng xuất
          </Button>
        </Paper>
      </Box>
    </>
  );
}
