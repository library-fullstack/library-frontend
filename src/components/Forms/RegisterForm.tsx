import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterForm(): React.ReactElement {
  const navigate = useNavigate();

  const [studentId, setStudentId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, {
        student_id: studentId,
        password,
      });
      setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message;
        if (Array.isArray(errorMsg)) {
          setError(errorMsg.join(", "));
        } else {
          setError(errorMsg || "Đăng ký thất bại");
        }
      } else {
        setError("Đăng ký thất bại");
      }
    }
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.95)",
            mb: 3,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Đăng ký
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleRegister}>
        <Typography
          sx={{ fontSize: 13, color: "white", mb: 1, fontWeight: 500 }}
        >
          Mã sinh viên
        </Typography>
        <TextField
          fullWidth
          placeholder="VD: 231032xxx24"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
            },
          }}
        />

        <Typography
          sx={{
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
            mb: 2,
            fontStyle: "italic",
          }}
        ></Typography>

        <Typography
          sx={{ fontSize: 13, color: "white", mb: 1, fontWeight: 500 }}
        >
          Mật khẩu
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  size="small"
                  sx={{ color: "#777" }}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
            },
          }}
        />

        <Typography
          sx={{ fontSize: 13, color: "white", mb: 1, fontWeight: 500 }}
        >
          Nhập lại mật khẩu
        </Typography>
        <TextField
          fullWidth
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
            },
          }}
        />

        <Button
          fullWidth
          type="submit"
          sx={{
            py: "10px",
            mb: 2,
            borderRadius: "10px",
            fontWeight: 600,
            background: "rgba(255,255,255,0.25)",
            color: "white",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255,255,255,0.35)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Đăng ký
        </Button>

        <Typography
          textAlign="center"
          sx={{ color: "white", fontSize: "14px" }}
        >
          Đã có tài khoản?{" "}
          <Box
            component="span"
            onClick={() => navigate("/auth/login")}
            sx={{
              color: "#FFD8B0",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Đăng nhập
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
