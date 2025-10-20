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
import useAuth from "../../../hooks/useAuth";
import { AxiosError } from "axios";

export default function LoginForm(): React.ReactElement {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setError("");

    try {
      await login(identifier, password);
      // Đợi một chút để đảm bảo state được cập nhật
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        (err as Error)?.message ||
        "Đăng nhập thất bại";
      setError(errorMessage);
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
          Đăng nhập
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin}>
        <Typography
          sx={{ fontSize: 13, color: "white", mb: 1, fontWeight: 500 }}
        >
          Mã sinh viên hoặc email
        </Typography>
        <TextField
          fullWidth
          placeholder="VD: 231032xxx24"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
            mb: 1,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
            },
          }}
        />

        <Box textAlign="right" mb={2}>
          <Typography
            onClick={() => navigate("/auth/forgot-password")}
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-block",
              "&:hover": {
                textDecoration: "underline",
                color: "#fff",
              },
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

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
          Đăng nhập
        </Button>

        <Typography
          textAlign="center"
          sx={{ color: "white", fontSize: "14px" }}
        >
          Chưa có tài khoản?{" "}
          <Box
            component="span"
            onClick={() => navigate("/auth/register")}
            sx={{
              color: "#FFD8B0",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Đăng ký ngay
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
