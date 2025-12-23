import React from "react";
import { Container, Box, Typography } from "@mui/material";
import SeoMetaTags from "../../shared/components/SeoMetaTags";
import ConsultingSection from "./services/ConsultingSection";
import BorrowPolicySection from "./services/BorrowPolicySection";
import ReadingRoomSection from "./services/ReadingRoomSection";
import UserTrainingSection from "./services/UserTrainingSection";

export default function Services(): React.ReactElement {
  return (
    <>
      <SeoMetaTags
        title="Dịch vụ thư viện"
        description="Các dịch vụ của Thư viện HBH: Tư vấn thông tin, mượn/trả tài liệu, đọc tại chỗ, hướng dẫn người dùng"
      />

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: { xs: 6, md: 8 },
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                textAlign: "center",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                mb: 2,
              }}
            >
              Dịch vụ thư viện
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                maxWidth: 700,
                mx: "auto",
                opacity: 0.95,
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Thư viện cung cấp đa dạng dịch vụ hỗ trợ học tập và nghiên cứu cho
              cán bộ, giảng viên và sinh viên
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ConsultingSection />
            <BorrowPolicySection />
            <ReadingRoomSection />
            <UserTrainingSection />
          </Box>
        </Container>
      </Box>
    </>
  );
}
