import React from "react";
import { Box } from "@mui/material";
import HeroBanner from "../../widgets/hero-banner/HeroBanner";
import FeaturedBooks from "../../widgets/featured-books/FeaturedBooks";
import DiscoverSection from "../../shared/ui/DiscoverSection";
import CommunitySection from "../../shared/ui/CommunitySection";
import GettingStartedSection from "../../shared/ui/GettingStartedSection";
import NewsAndEventsSection from "../../shared/ui/NewsAndEventsSection";
import Footer from "../../shared/ui/Footer";

// homepage
const HomePage: React.FC = React.memo(() => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* cái banner đầu trang */}
      <HeroBanner />
      {/* cái danh sách sách tự chạy  */}
      <FeaturedBooks />
      {/* section cho đặc sắc - hơi xấu, sửa sau*/}
      <DiscoverSection />
      {/* giới thiệu  */}
      <GettingStartedSection />
      {/* tin tức và sự kiện */}
      <NewsAndEventsSection />
      {/* giới thiệu diễn đàn */}
      <CommunitySection />
      {/* footer thôi */}
      <Footer />
    </Box>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
