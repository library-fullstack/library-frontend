import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../../../shared/lib/errorHandler";

export default function LoginForm(): React.ReactElement {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await login(identifier, password);
      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => (window.location.href = "/"), 1200);
    } catch (err) {
      setError(parseApiError(err));
    }
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
        Đăng nhập
      </Typography>
      <Typography
        textAlign="center"
        sx={{
          color: theme.palette.text.secondary,
          mb: 4,
          fontSize: 15,
        }}
      >
        Truy cập hệ thống thư viện HBH
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
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          variant="filled"
          sx={{
            mb: 3,
            borderRadius: 1.5,
            fontSize: 14,
            py: 1.2,
            alignItems: "center",
          }}
        >
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin}>
        <Typography
          sx={{
            fontSize: 14,
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Mã sinh viên hoặc Email
        </Typography>
        <TextField
          fullWidth
          placeholder="VD: 231032xxx24"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />

        <Typography
          sx={{
            fontSize: 14,
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
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
                  edge="end"
                >
                  {showPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />

        <Box textAlign="right" mb={3}>
          <Typography
            onClick={() => navigate("/auth/forgot-password")}
            sx={{
              color: theme.palette.primary.main,
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
                opacity: 0.8,
              },
              transition: "opacity 0.2s ease",
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            py: 1.5,
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: 15,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Đăng nhập
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Typography textAlign="center" sx={{ fontSize: 14 }}>
        Chưa có tài khoản?{" "}
        <Box
          component="span"
          onClick={() => navigate("/auth/register")}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Đăng ký ngay
        </Box>
      </Typography>
    </motion.div>
  );
}
