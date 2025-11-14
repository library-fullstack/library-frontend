import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import MenuBar from "../menubar/MenuBar";
import { Box, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import ScrollMemory from "../../components/ScrollMemory";
import OfflineSupport from "../../shared/components/OfflineSupport";
import { STORAGE_KEYS } from "../../shared/lib/storageKeys";

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const [logoutSnackOpen, setLogoutSnackOpen] = React.useState(false);

  React.useEffect(() => {
    const logoutFlag = sessionStorage.getItem(
      STORAGE_KEYS.session.logoutSuccess
    );

    if (logoutFlag === "1") {
      sessionStorage.removeItem(STORAGE_KEYS.session.logoutSuccess);
      setLogoutSnackOpen(true);
    }
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <OfflineSupport />
      <ScrollMemory />

      {!isAuthPage && <Navbar />}
      {!isAuthPage && <MenuBar />}
      <Outlet />

      <Snackbar
        open={logoutSnackOpen}
        autoHideDuration={2500}
        onClose={() => setLogoutSnackOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{
          top: { xs: "60px", sm: "140px" },
          zIndex: 99999,
        }}
      >
        <Alert
          onClose={() => setLogoutSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Đã đăng xuất thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
}
