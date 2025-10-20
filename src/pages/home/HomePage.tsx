import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/Layout/Navbar";
import MenuBar from "../../components/Layout/MenuBar";
import HeroBanner from "../../components/HeroBanner";
import FeaturedBooks from "../../components/FeaturedBooks";

// homepage
const HomePage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#FAFAFA" }}>
      {/* navbar */}
      <Navbar />
      {/* menubar */}
      <MenuBar />
      {/* cái banner đầu trang */}
      <HeroBanner />
      {/* cái danh sách sách tự chạy  */}
      <FeaturedBooks />
    </Box>
  );
};

export default HomePage;
