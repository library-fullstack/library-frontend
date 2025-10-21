import React from "react";
import { Box } from "@mui/material";
import HeroBanner from "../../components/HeroBanner";
import FeaturedBooks from "../../components/FeaturedBooks";
import DiscoverSection from "../../components/commons/DiscoverSection";

// homepage
const HomePage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#FAFAFA" }}>
      {/* cái banner đầu trang */}
      <HeroBanner />
      {/* cái danh sách sách tự chạy  */}
      <FeaturedBooks />
      {/* section cho đặc sắc - hơi xấu, sửa sau*/}
      <DiscoverSection />
    </Box>
  );
};

export default HomePage;
