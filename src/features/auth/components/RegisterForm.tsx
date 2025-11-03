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
import { Visibility, VisibilityOff, Check, Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../shared/api/axiosClient";
import StorageUtil from "../../../shared/lib/storage";
import {
  parseApiError,
  validatePassword,
} from "../../../shared/lib/errorHandler";
import { CircularProgress } from "@mui/material";

type RegisterResponse = {
  message: string;
  require_info_confirm?: boolean;
  token?: string;
  user_preview?: {
    student_id: string;
    full_name: string;
    email: string;
    phone: string;
  };
};

export default function RegisterForm(): React.ReactElement {
  const navigate = useNavigate();
  const theme = useTheme();

  const [studentId, setStudentId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [confirmTouched, setConfirmTouched] = React.useState(false);

  const passwordValidation = validatePassword(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!passwordValidation.isValid) {
      setError("Mật khẩu chưa đáp ứng đầy đủ yêu cầu bảo mật.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      setIsRegistering(true);
      const res = await axiosClient.post<RegisterResponse>("/auth/register", {
        student_id: studentId,
        password,
      });

      if (res.data.require_info_confirm) {
        StorageUtil.setJSON("pending_student_info", {
          token: res.data.token,
          user_preview: res.data.user_preview,
          createdAt: Date.now(),
        });
        navigate("/auth/confirm-info");
      } else {
        setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsRegistering(false);
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
        Đăng ký tài khoản
      </Typography>
      <Typography
        textAlign="center"
        sx={{
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: 14,
        }}
      >
        Tham gia hệ thống thư viện HBH
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
      {success && (
        <Alert
          severity="success"
          variant="filled"
          sx={{
            mb: 2.5,
            borderRadius: 1.5,
            fontSize: 13,
            py: 1,
            alignItems: "center",
          }}
        >
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleRegister}>
        <Typography
          sx={{
            fontSize: 13,
            mb: 0.75,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Mã sinh viên
        </Typography>
        <TextField
          fullWidth
          size="medium"
          placeholder="VD: 231032xxx24"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
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
          onBlur={() => setPasswordTouched(true)}
          required
          error={passwordTouched && !passwordValidation.isValid}
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
            mb: 1.25,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
            },
          }}
        />

        {password.length > 0 && (
          <Box sx={{ mb: 1.75 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}
            >
              <Box
                sx={{
                  height: 3,
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
                  fontSize: 11,
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

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: passwordValidation.hasMinLength
                      ? "#22c55e"
                      : theme.palette.mode === "dark"
                      ? "#3F4147"
                      : "#E5E7EB",
                    transition: "all 0.2s ease",
                  }}
                >
                  {passwordValidation.hasMinLength && (
                    <Check sx={{ fontSize: 12, color: "#FFFFFF" }} />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: passwordValidation.hasMinLength ? 500 : 400,
                    color: passwordValidation.hasMinLength
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                  }}
                >
                  Tối thiểu 6 ký tự
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: passwordValidation.hasUpperCase
                      ? "#22c55e"
                      : theme.palette.mode === "dark"
                      ? "#3F4147"
                      : "#E5E7EB",
                    transition: "all 0.2s ease",
                  }}
                >
                  {passwordValidation.hasUpperCase && (
                    <Check sx={{ fontSize: 12, color: "#FFFFFF" }} />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: passwordValidation.hasUpperCase ? 500 : 400,
                    color: passwordValidation.hasUpperCase
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                  }}
                >
                  Có chữ in hoa
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: passwordValidation.hasNumber
                      ? "#22c55e"
                      : theme.palette.mode === "dark"
                      ? "#3F4147"
                      : "#E5E7EB",
                    transition: "all 0.2s ease",
                  }}
                >
                  {passwordValidation.hasNumber && (
                    <Check sx={{ fontSize: 12, color: "#FFFFFF" }} />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: passwordValidation.hasNumber ? 500 : 400,
                    color: passwordValidation.hasNumber
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                  }}
                >
                  Có chữ số
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: passwordValidation.hasSpecialChar
                      ? "#22c55e"
                      : theme.palette.mode === "dark"
                      ? "#3F4147"
                      : "#E5E7EB",
                    transition: "all 0.2s ease",
                  }}
                >
                  {passwordValidation.hasSpecialChar && (
                    <Check sx={{ fontSize: 12, color: "#FFFFFF" }} />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: passwordValidation.hasSpecialChar ? 500 : 400,
                    color: passwordValidation.hasSpecialChar
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                  }}
                >
                  Có ký tự đặc biệt (!@#$%^&*)
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Typography
          sx={{
            fontSize: 13,
            mb: 0.75,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Nhập lại mật khẩu
        </Typography>
        <TextField
          fullWidth
          size="medium"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmTouched(true)}
          required
          error={
            confirmTouched && confirmPassword.length > 0 && !passwordsMatch
          }
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
                      <Check sx={{ fontSize: 18, color: "#22c55e" }} />
                    ) : (
                      <Close sx={{ fontSize: 18, color: "#ef4444" }} />
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
            mb: 2.5,
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
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
            },
          }}
        />

        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          loading={isRegistering}
          loadingIndicator={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress color="inherit" size={18} thickness={4} />
              <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                Đang đăng ký...
              </Typography>
            </Box>
          }
          disabled={!passwordValidation.isValid || !passwordsMatch}
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
          Đăng ký
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <Typography textAlign="center" sx={{ fontSize: 13 }}>
        Đã có tài khoản?{" "}
        <Box
          component="span"
          onClick={() => navigate("/auth/login")}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
              opacity: 0.8,
            },
            transition: "opacity 0.2s ease",
          }}
        >
          Đăng nhập ngay
        </Box>
      </Typography>
    </motion.div>
  );
}
