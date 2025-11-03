import * as React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  InputBase,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../shared/api/axiosClient";
import StorageUtil from "../../../shared/lib/storage";
import { parseApiError } from "../../../shared/lib/errorHandler";
import { ArrowForward, ArrowBack } from "@mui/icons-material";

interface SystemSettingsResponse {
  allow_student_info_edit: boolean;
}

type FieldKey = "full_name" | "email" | "phone";

interface FieldConfig {
  key: FieldKey;
  label: string;
  questionParts: {
    before: string;
    placeholder: string;
    after: string;
  };
  validate: (value: string) => string | null;
}

const FIELDS: FieldConfig[] = [
  {
    key: "full_name",
    label: "Họ và tên",
    questionParts: {
      before: "Tên của bạn là",
      placeholder: "Nguyễn Văn A",
      after: "đúng không?",
    },
    validate: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return "Vui lòng nhập họ tên";
      if (trimmed.length < 3) return "Họ tên quá ngắn (tối thiểu 3 ký tự)";
      if (trimmed.length > 50) return "Họ tên quá dài (tối đa 50 ký tự)";
      if (!/^[A-Za-zÀ-ỹ\s]+$/.test(trimmed))
        return "Họ tên chỉ được chứa chữ cái";
      return null;
    },
  },
  {
    key: "email",
    label: "Email",
    questionParts: {
      before: "Email của bạn là",
      placeholder: "example@gmail.com",
      after: "có đúng không ?",
    },
    validate: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return "Vui lòng nhập email";
      if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmed)) return "Email không hợp lệ";
      return null;
    },
  },
  {
    key: "phone",
    label: "Số điện thoại",
    questionParts: {
      before: "Số điện thoại thì sao ?",
      placeholder: "0123456789",
      after: "đúng chứ?",
    },
    validate: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return "Vui lòng nhập số điện thoại";
      if (!/^0\d{9}$/.test(trimmed))
        return "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
      return null;
    },
  },
];

const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  onComplete?: () => void;
}> = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

export default function ConfirmStudentInfo(): React.ReactElement | null {
  const [showInput, setShowInput] = React.useState(false);
  const [showAfter, setShowAfter] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const previewData = StorageUtil.getJSON<{
    token: string;
    user_preview: {
      student_id: string;
      full_name: string;
      email: string;
      phone: string;
    };
    createdAt: number;
  }>("pending_student_info");
  const preview = previewData?.user_preview;
  const token = previewData?.token;

  const [step, setStep] = React.useState(0);
  const [info, setInfo] = React.useState({
    full_name: preview?.full_name || "",
    email: preview?.email || "",
    phone: preview?.phone || "",
  });

  const [inputValue, setInputValue] = React.useState("");
  const [validationError, setValidationError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentField = FIELDS[step];

  React.useEffect(() => {
    let mounted = true;

    if (!preview || !token) {
      navigate("/auth/login", { replace: true });
      return;
    }

    const createdAt = previewData?.createdAt || 0;
    const expired = Date.now() - createdAt > 5 * 60 * 1000;

    if (expired) {
      StorageUtil.removeItem("pending_student_info");
      navigate("/auth/login", {
        replace: true,
        state: { message: "Phiên xác nhận đã hết hạn. Vui lòng đăng ký lại." },
      });
      return;
    }

    axiosClient
      .get<SystemSettingsResponse>("/admin/system/settings")
      .then((res) => {
        if (mounted && !res.data.allow_student_info_edit) {
          StorageUtil.removeItem("pending_student_info");
          navigate("/auth/login", { replace: true });
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setInputValue(info[currentField.key]);
    setValidationError("");
    setShowInput(false);
    setShowAfter(false);
    setShowButtons(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  React.useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollLeft = 0;
    }
  }, [showInput]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.trim()) {
      const error = currentField.validate(value);
      setValidationError(error || "");
    } else {
      setValidationError("");
    }
  };

  const handleNext = async () => {
    const error = currentField.validate(inputValue);
    if (error) {
      setValidationError(error);
      return;
    }

    setInfo({ ...info, [currentField.key]: inputValue.trim() });

    if (step < FIELDS.length - 1) {
      setStep((s) => s + 1);
    } else {
      await handleConfirm();
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/users/confirm-student-info", {
        token,
        full_name: info.full_name.trim(),
        email: info.email.trim(),
        phone: inputValue.trim(),
      });

      StorageUtil.removeItem("pending_student_info");
      navigate("/auth/login", {
        replace: true,
        state: {
          message: "Xác nhận thành công! Vui lòng đăng nhập.",
          severity: "success",
        },
      });
    } catch (err) {
      let msg = parseApiError(err);

      // Handle timeout error
      if (err instanceof Error && err.name === "AbortError") {
        msg = "Yêu cầu quá lâu. Vui lòng kiểm tra kết nối và thử lại.";
      }

      setError(msg || "Không thể xác nhận thông tin. Vui lòng thử lại.");

      if (
        msg.includes("Token không hợp lệ") ||
        msg.includes("hết hạn") ||
        msg.includes("đã bị đóng")
      ) {
        StorageUtil.removeItem("pending_student_info");
        navigate("/auth/login", {
          replace: true,
          state: {
            message:
              "Phiên xác nhận đã hết hạn hoặc bị đóng. Vui lòng đăng ký lại.",
            severity: "error",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!preview) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: 600, width: "100%", px: 3 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  component="div"
                  sx={{
                    fontSize: { xs: 28, sm: 36 },
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: theme.palette.text.primary,
                  }}
                >
                  <TypewriterText
                    text={currentField.questionParts.before}
                    speed={30}
                    onComplete={() => {
                      setTimeout(() => setShowInput(true), 250);
                    }}
                  />
                </Typography>

                <Box sx={{ mt: 3, position: "relative" }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showInput ? 1 : 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <InputBase
                        inputRef={inputRef}
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onFocus={(e) => {
                          e.target.scrollLeft = 0;
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !validationError &&
                            !loading &&
                            inputValue.trim()
                          ) {
                            handleNext();
                          }
                        }}
                        placeholder={currentField.questionParts.placeholder}
                        disabled={loading || !showInput}
                        sx={{
                          fontSize: { xs: 24, sm: 32 },
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          px: 2,
                          pb: 1,
                          width: "100%",
                          maxWidth: 500,
                          position: "relative",
                          "& input": {
                            textAlign: "left",
                            "&::placeholder": {
                              color: theme.palette.text.disabled,
                              opacity: 0.5,
                            },
                          },
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          height: "3px",
                          bgcolor: theme.palette.divider,
                          width: "100%",
                          maxWidth: 500,
                        }}
                      />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: showInput ? 1 : 0 }}
                        transition={{
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          height: "3px",
                          backgroundColor: theme.palette.primary.main,
                          width: "100%",
                          maxWidth: 500,
                          transformOrigin: "left",
                        }}
                      />
                    </Box>
                  </motion.div>
                </Box>

                <Box sx={{ mt: 2, minHeight: 40 }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showInput ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 18 },
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {showInput && !showAfter && (
                        <TypewriterText
                          text={currentField.questionParts.after}
                          speed={30}
                          onComplete={() => {
                            setShowAfter(true);
                            setTimeout(() => setShowButtons(true), 200);
                          }}
                        />
                      )}
                      {showAfter && currentField.questionParts.after}
                    </Typography>
                  </motion.div>
                </Box>
              </Box>

              {validationError && showInput && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: theme.palette.error.main,
                      mt: 2,
                      fontWeight: 500,
                    }}
                  >
                    {validationError}
                  </Typography>
                </motion.div>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showButtons ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {step > 0 && (
                  <Button
                    variant="text"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={loading || !showButtons}
                    startIcon={<ArrowBack />}
                    sx={{
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: 500,
                      px: 2.5,
                      py: 1.25,
                      color: theme.palette.text.secondary,
                      borderRadius: 12,
                      border: `1px solid ${theme.palette.divider}`,
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        borderColor: theme.palette.text.secondary,
                      },
                    }}
                  >
                    Quay lại
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    !!validationError ||
                    loading ||
                    !inputValue.trim() ||
                    !showButtons
                  }
                  endIcon={
                    loading ? null : step < FIELDS.length - 1 ? (
                      <ArrowForward />
                    ) : null
                  }
                  sx={{
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    px: 3.5,
                    py: 1.25,
                    borderRadius: 12,
                    minWidth: 120,
                    boxShadow: "none",
                    bgcolor: theme.palette.primary.main,
                    color: "#fff",
                    border: `2px solid ${theme.palette.primary.main}`,
                    "&:hover": {
                      boxShadow: `0 0 0 4px ${
                        theme.palette.mode === "dark"
                          ? "rgba(144, 202, 249, 0.15)"
                          : "rgba(25, 118, 210, 0.1)"
                      }`,
                      bgcolor: theme.palette.primary.dark,
                      borderColor: theme.palette.primary.dark,
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "none",
                    },
                    "&.Mui-disabled": {
                      bgcolor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                      borderColor: "transparent",
                    },
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : step < FIELDS.length - 1 ? (
                    "Tiếp tục"
                  ) : (
                    "Hoàn tất"
                  )}
                </Button>
              </Box>

              <Typography
                sx={{
                  mt: 4,
                  fontSize: 13,
                  color: theme.palette.text.disabled,
                  fontWeight: 500,
                }}
              >
                Bước {step + 1} / {FIELDS.length}
              </Typography>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
