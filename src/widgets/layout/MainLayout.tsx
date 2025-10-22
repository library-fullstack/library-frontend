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
    <Box sx={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <MenuBar />}
      <Outlet />
    </Box>
  );
}
