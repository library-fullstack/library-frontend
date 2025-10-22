import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
} from "@mui/material";
import { ArrowBack, CheckCircleOutline, Home } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "../../../shared/lib/errorHandler";
import { authApi } from "../api/auth.api";

export default function ForgotPasswordForm(): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isEmailValid = email.includes("@") && email.includes(".");

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    try {
      setLoading(true);
      await authApi.forgotPassword({ email });
      setEmailSent(true);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  // Success State - Hiển thị sau khi gửi email thành công
  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: 2,
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(34, 197, 94, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
            }}
          >
            <CheckCircleOutline
              sx={{
                fontSize: 48,
                color: "#22c55e",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
              fontSize: { xs: 24, sm: 28 },
            }}
          >
            Email đã được gửi!
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              mb: 1,
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Hướng dẫn đặt lại mật khẩu đã được gửi tới
          </Typography>

          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mb: 4,
              fontSize: 15,
            }}
          >
            {email}
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 14,
              mb: 4,
              px: 2,
            }}
          >
            Vui lòng kiểm tra hộp thư đến (và cả thư rác) để tìm email chứa liên
            kết đặt lại mật khẩu.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/auth/login")}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                fontWeight: 600,
                fontSize: 15,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              Quay về đăng nhập
            </Button>

            <Button
              fullWidth
              variant="text"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                fontWeight: 500,
                fontSize: 15,
                textTransform: "none",
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.04)",
                },
              }}
            >
              Về trang chủ
            </Button>
          </Box>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 1,
          color: theme.palette.text.primary,
          fontSize: { xs: 28, sm: 32 },
        }}
      >
        Quên mật khẩu
      </Typography>

      <Typography
        textAlign="center"
        sx={{
          color: theme.palette.text.secondary,
          mb: 4,
          fontSize: 15,
        }}
      >
        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
      </Typography>

      {error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            mb: 3,
            borderRadius: 1.5,
            fontSize: 14,
            py: 1.2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleForgotPassword}>
        <Typography
          sx={{
            fontSize: 14,
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Email
        </Typography>
        <TextField
          fullWidth
          placeholder="abc@student.uneti.edu.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={!email.trim() || loading}
          sx={{
            py: 1.5,
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: 15,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>

        <Button
          fullWidth
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/auth/login")}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 1.5,
            fontWeight: 500,
            fontSize: 15,
            textTransform: "none",
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
            },
          }}
        >
          Quay lại đăng nhập
        </Button>
      </Box>
    </motion.div>
  );
}
