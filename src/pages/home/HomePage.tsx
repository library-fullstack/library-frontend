import React from "react";
import { Box } from "@mui/material";
import HeroBanner from "../../widgets/hero-banner/HeroBanner";
import FeaturedBooks from "../../widgets/featured-books/FeaturedBooks";
import DiscoverSection from "../../shared/ui/DiscoverSection";

// homepage
const HomePage: React.FC = () => {
  return (
    <Box
      sx={{ backgroundColor: "#FAFAFA", width: "100%", overflowX: "hidden" }}
    >
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
