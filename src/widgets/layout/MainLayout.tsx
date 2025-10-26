import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import MenuBar from "../menubar/MenuBar";
import { Box } from "@mui/material";

// main layout
export default function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

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
    </Box>
  );
}
