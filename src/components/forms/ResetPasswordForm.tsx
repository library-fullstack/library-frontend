import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Check,
  CheckCircleOutline,
  Home,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseApiError, validatePassword } from "../../utils/errorHandler";
import { authApi } from "../../api/auth.api";

export default function ResetPasswordForm(): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [confirmTouched, setConfirmTouched] = React.useState(false);

  const passwordValidation = validatePassword(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  // kiểm tra token khi vừa load trang
  React.useEffect(() => {
    if (!token) {
      setError("Liên kết không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!token) {
      setError("Liên kết không hợp lệ.");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Mật khẩu chưa đáp ứng đầy đủ yêu cầu bảo mật.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({ token, new_password: password });
      setResetSuccess(true);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  // reset thành công
  if (resetSuccess) {
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
            Đặt lại mật khẩu thành công!
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              fontSize: 15,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu
            mới ngay bây giờ.
          </Typography>

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
              Đăng nhập ngay
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
        Đặt lại mật khẩu
      </Typography>

      <Typography
        textAlign="center"
        sx={{
          color: theme.palette.text.secondary,
          mb: 4,
          fontSize: 15,
        }}
      >
        Nhập mật khẩu mới cho tài khoản của bạn
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

      <Box component="form" onSubmit={handleResetPassword}>
        <Typography
          sx={{
            fontSize: 14,
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Mật khẩu mới
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          required
          error={passwordTouched && !passwordValidation.isValid}
          disabled={!token}
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
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  height: 4,
                  flex: 1,
                  borderRadius: 2,
                  bgcolor: theme.palette.divider,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width:
                      passwordValidation.strength === "strong"
                        ? "100%"
                        : passwordValidation.strength === "medium"
                        ? "66%"
                        : "33%",
                    bgcolor:
                      passwordValidation.strength === "strong"
                        ? "#22c55e"
                        : passwordValidation.strength === "medium"
                        ? "#f59e0b"
                        : "#ef4444",
                    transition: "all 0.3s ease",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color:
                    passwordValidation.strength === "strong"
                      ? "#22c55e"
                      : passwordValidation.strength === "medium"
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {passwordValidation.strength === "strong"
                  ? "Mạnh"
                  : passwordValidation.strength === "medium"
                  ? "Trung bình"
                  : "Yếu"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {[
                {
                  valid: passwordValidation.hasMinLength,
                  label: "Tối thiểu 6 ký tự",
                },
                {
                  valid: passwordValidation.hasUpperCase,
                  label: "Có chữ in hoa",
                },
                { valid: passwordValidation.hasNumber, label: "Có chữ số" },
                {
                  valid: passwordValidation.hasSpecialChar,
                  label: "Có ký tự đặc biệt (!@#$%^&*)",
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: item.valid
                        ? "#22c55e"
                        : theme.palette.mode === "dark"
                        ? "#3F4147"
                        : "#E5E7EB",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.valid && (
                      <Check sx={{ fontSize: 14, color: "#FFFFFF" }} />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: item.valid ? 500 : 400,
                      color: item.valid
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Typography
          sx={{
            fontSize: 14,
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Nhập lại mật khẩu mới
        </Typography>
        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmTouched(true)}
          required
          error={
            confirmTouched && confirmPassword.length > 0 && !passwordsMatch
          }
          disabled={!token}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {confirmPassword.length > 0 && (
                  <Box
                    sx={{
                      mr: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {passwordsMatch ? (
                      <Check sx={{ fontSize: 20, color: "#22c55e" }} />
                    ) : (
                      <Box
                        sx={{
                          fontSize: 20,
                          color: "#ef4444",
                          display: "flex",
                        }}
                      >
                        ✕
                      </Box>
                    )}
                  </Box>
                )}
                <IconButton
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  size="small"
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              ...(passwordsMatch &&
                !confirmTouched && {
                  "& fieldset": {
                    borderColor: "#22c55e !important",
                    borderWidth: "2px !important",
                  },
                }),
            },
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={
            !token || !passwordValidation.isValid || !passwordsMatch || loading
          }
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
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </Button>
      </Box>
    </motion.div>
  );
}
