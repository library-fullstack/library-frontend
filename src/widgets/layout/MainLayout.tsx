import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import MenuBar from "../menubar/MenuBar";
import { Box, Snackbar, Alert } from "@mui/material";

// main layout
export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname.startsWith("/auth");
  const [loginSnackOpen, setLoginSnackOpen] = React.useState(false);

  React.useEffect(() => {
    const state = location.state as { loginSuccess?: boolean } | null;
    const fromState = Boolean(state?.loginSuccess);
    const fromSession = sessionStorage.getItem("loginSuccessOnce") === "1";
    if (fromState || fromSession) {
      setLoginSnackOpen(true);
      if (fromSession) sessionStorage.removeItem("loginSuccessOnce");
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <MenuBar />}
      <Outlet />
      {!isAuthPage && (
        <Snackbar
          open={loginSnackOpen}
          autoHideDuration={2500}
          onClose={() => setLoginSnackOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ mt: 8 }}
        >
          <Alert
            onClose={() => setLoginSnackOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Đăng nhập thành công!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
