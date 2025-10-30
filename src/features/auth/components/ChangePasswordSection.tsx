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
} from "@mui/material";
import { usersApi } from "../../users/api/users.api";

export default function ChangePasswordSection() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");

  useEffect(() => {
    sessionStorage.setItem("changePassStep", step);
    sessionStorage.setItem("changePassOtp", otp);
  }, [step, otp]);

  useEffect(() => {
    const savedStep = sessionStorage.getItem("changePassStep") as
      | "form"
      | "otp"
      | null;
    const savedOtp = sessionStorage.getItem("changePassOtp") || "";
    if (savedStep) setStep(savedStep);
    if (savedOtp) setOtp(savedOtp);
  }, []);

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // tính độ mạnh mật khẩu
  const strength = (() => {
    let score = 0;
    if (newPass.length >= 8) score++;
    if (/[A-Z]/.test(newPass)) score++;
    if (/[0-9]/.test(newPass)) score++;
    if (/[^A-Za-z0-9]/.test(newPass)) score++;
    return score;
  })();

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
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err.response?.data?.message || "Mật khẩu hiện tại không đúng.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPass !== confirm) {
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
        message: "Đổi mật khẩu thành công!",
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err.response?.data?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await usersApi.sendOtp("change_password");
      setSnackbar({
        open: true,
        message: "Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.",
        severity: "success",
      });
      setResendTimer(60);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
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
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            helperText="Tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt"
            FormHelperTextProps={{
              sx: { ml: 0.5, fontSize: "0.75rem", color: "text.secondary" },
            }}
          />
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
                sx={{
                  height: 4, // 👈 mảnh hơn
                  borderRadius: 2,
                  width: "calc(100% - 4px)", // 👈 canh đều với input
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  ml: 0.5, // 👈 canh thẳng với textfield
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
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleCheckPassword}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Gửi mã OTP xác nhận
          </Button>
        </Stack>
      )}

      {step === "otp" && (
        <Stack spacing={2}>
          <TextField
            label="Mã OTP (6 chữ số)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
            fullWidth
          />
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleChangePassword}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Xác nhận đổi mật khẩu
          </Button>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
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
