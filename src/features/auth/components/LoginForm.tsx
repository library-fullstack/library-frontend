import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../../../shared/lib/errorHandler";
import { CircularProgress } from "@mui/material";

export default function LoginForm(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { login } = useAuth();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // lấy cái trang lúc bấm mà bị redirect về login
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoggingIn) {
      return;
    }

    setError("");
    setIsLoggingIn(true);

    try {
      await login(identifier, password);

      sessionStorage.setItem("loginSuccessOnce", "1");
      navigate(from || "/", { replace: true, state: { loginSuccess: true } });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoggingIn(false);
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
          mb: 0.75,
          color: theme.palette.text.primary,
          fontSize: { xs: 26, sm: 30 },
        }}
      >
        Đăng nhập
      </Typography>
      <Typography
        textAlign="center"
        sx={{
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: 14,
        }}
      >
        Truy cập hệ thống thư viện HBH
      </Typography>

      {error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            mb: 2.5,
            borderRadius: 1.5,
            fontSize: 13,
            py: 1,
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin}>
        <Typography
          sx={{
            fontSize: 13,
            mb: 0.75,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Mã sinh viên hoặc Email
        </Typography>
        <TextField
          fullWidth
          size="medium"
          placeholder="231032xxx24 / abc@abc.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
            },
          }}
        />

        <Typography
          sx={{
            fontSize: 13,
            mb: 0.75,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Mật khẩu
        </Typography>
        <TextField
          fullWidth
          size="medium"
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
            mb: 1.75,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
            },
          }}
        />

        <Box textAlign="right" mb={2.5}>
          <Typography
            onClick={() => navigate("/auth/forgot-password")}
            sx={{
              color: theme.palette.primary.main,
              fontSize: 13,
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

        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          loading={isLoggingIn}
          loadingIndicator={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress color="inherit" size={18} thickness={4} />
              <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                Đang đăng nhập...
              </Typography>
            </Box>
          }
          disabled={isLoggingIn}
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
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 2.5 }} />
      <Typography textAlign="center" sx={{ fontSize: 13 }}>
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
