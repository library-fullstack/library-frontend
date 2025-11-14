import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  LinearProgress,
  Typography,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff, Check, Close } from "@mui/icons-material";
import type { ApiError } from "../../../shared/types/api-error";
import { usersApi } from "../../users/api/users.api";
import useAuth from "../../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";

export default function ChangePasswordSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // giữ step và otp khi reload
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.session.changePassStep, step);
    sessionStorage.setItem(STORAGE_KEYS.session.changePassOtp, otp);
  }, [step, otp]);

  useEffect(() => {
    const savedStep = sessionStorage.getItem(
      STORAGE_KEYS.session.changePassStep
    ) as "form" | "otp" | null;
    const savedOtp =
      sessionStorage.getItem(STORAGE_KEYS.session.changePassOtp) || "";
    if (savedStep) setStep(savedStep);
    if (savedOtp) setOtp(savedOtp);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const strength = (() => {
    let score = 0;
    if (newPass.length >= 8) score++;
    if (/[A-Z]/.test(newPass)) score++;
    if (/[0-9]/.test(newPass)) score++;
    if (/[^A-Za-z0-9]/.test(newPass)) score++;
    return score;
  })();

  const passwordsMatch = confirm === newPass && confirm.length > 0;

  function handleLogout(): void {
    logout();
    navigate("/");
  }

  const handleCheckPassword = async () => {
    try {
      setLoading(true);
      await usersApi.checkPassword(current);
      await usersApi.sendOtp("change_password");
      setStep("otp");
      setSnackbar({
        open: true,
        message: "Mã OTP đã được gửi đến email của bạn.",
        severity: "success",
      });
      setResendTimer(60);
    } catch (error: unknown) {
      const err = error as ApiError;
      const msg =
        err.response?.data?.message || "Mật khẩu hiện tại không đúng.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordsMatch) {
      setSnackbar({
        open: true,
        message: "Mật khẩu xác nhận không khớp.",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await usersApi.verifyChangePassword({
        old_password: current,
        new_password: newPass,
        otp_code: otp,
      });
      setSnackbar({
        open: true,
        message: "Đổi mật khẩu thành công! Đang đăng xuất...",
        severity: "success",
      });

      setCurrent("");
      setNewPass("");
      setConfirm("");
      setOtp("");
      setStep("form");
      setResendTimer(0);
      sessionStorage.removeItem("changePassStep");
      sessionStorage.removeItem("changePassOtp");

      setTimeout(() => handleLogout(), 1200);
    } catch (error: unknown) {
      const err = error as ApiError;
      const msg =
        err.response?.data?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) {
      return;
    }

    try {
      setLoading(true);
      await usersApi.sendOtp("change_password");
      setSnackbar({
        open: true,
        message: "Đã gửi lại mã OTP. Vui lòng kiểm tra email.",
        severity: "success",
      });
      setResendTimer(60);
    } catch (error: unknown) {
      const err = error as ApiError;
      const msg = err.response?.data?.message || "Không thể gửi lại mã OTP.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {step === "form" && (
        <Stack spacing={2}>
          {/* nhập mật khẩu hiện tại */}
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
            }}
          />

          {/* nhập mật khẩu mới */}
          <TextField
            label="Mật khẩu mới"
            fullWidth
            type={showNewPass ? "text" : "password"}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPass((p) => !p)}
                    size="small"
                    edge="end"
                  >
                    {showNewPass ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt"
            FormHelperTextProps={{
              sx: { ml: 0.5, fontSize: "0.75rem", color: "text.secondary" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
            }}
          />

          {/* thanh độ mạnh của mật khẩu */}
          {newPass.length > 0 && (
            <Box sx={{ mt: 0.5, ml: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={(strength / 4) * 100}
                color={
                  strength <= 1
                    ? "error"
                    : strength === 2
                    ? "warning"
                    : "success"
                }
                sx={{ height: 4, borderRadius: 2, width: "calc(100% - 4px)" }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  ml: 0.5,
                  color:
                    strength <= 1
                      ? "error.main"
                      : strength === 2
                      ? "warning.main"
                      : "success.main",
                }}
              >
                {["Yếu", "Trung bình", "Khá", "Mạnh"][strength - 1]}
              </Typography>
            </Box>
          )}

          {/* xác nhận mật khẩu mới*/}
          <TextField
            label="Xác nhận mật khẩu mới"
            fullWidth
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            error={confirm.length > 0 && !passwordsMatch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {confirm.length > 0 && (
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
                        <Close sx={{ fontSize: 20, color: "#ef4444" }} />
                      )}
                    </Box>
                  )}
                  <IconButton
                    onClick={() => setShowConfirm((p) => !p)}
                    size="small"
                    edge="end"
                  >
                    {showConfirm ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                ...(passwordsMatch && {
                  "& fieldset": {
                    borderColor: "#22c55e !important",
                    borderWidth: "2px !important",
                  },
                }),
                ...(!passwordsMatch &&
                  confirm.length > 0 && {
                    "& fieldset": {
                      borderColor: "#ef4444 !important",
                      borderWidth: "2px !important",
                    },
                  }),
              },
            }}
          />

          <LoadingButton
            variant="contained"
            disabled={loading}
            loading={loading}
            onClick={handleCheckPassword}
            loadingIndicator={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress color="inherit" size={16} thickness={4} />
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  Đang gửi mã...
                </Typography>
              </Box>
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              py: 1.2,
            }}
          >
            Gửi mã OTP xác nhận
          </LoadingButton>
        </Stack>
      )}

      {/* chỗ nhập OTP */}
      {step === "otp" && (
        <Stack spacing={2}>
          <TextField
            label="Mã OTP (6 chữ số)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
            fullWidth
          />
          <LoadingButton
            variant="contained"
            disabled={loading}
            loading={loading}
            loadingIndicator="Đang thay đổi..."
            onClick={handleChangePassword}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Xác nhận đổi mật khẩu
          </LoadingButton>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              disabled={resendTimer > 0 || loading}
              onClick={handleResendOtp}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {resendTimer > 0
                ? `Gửi lại OTP (${resendTimer}s)`
                : "Gửi lại mã OTP"}
            </Button>

            <Button
              variant="text"
              onClick={() => setStep("form")}
              sx={{ textTransform: "none" }}
            >
              Quay trở lại
            </Button>
          </Stack>
        </Stack>
      )}

      {/* snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{
          top: { xs: "60px", sm: "140px" },
          zIndex: 9999,
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
