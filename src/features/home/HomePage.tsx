import React from "react";
import { Box } from "@mui/material";
import HeroBanner from "../../components/Common/HeroBanner";
import FeaturedBooks from "../../components/FeaturedBooks";

const HomePage: React.FC = () => {
  return (
    <Box>
      <HeroBanner />
      <FeaturedBooks />
    </Box>
  );
};

export default HomePage;
