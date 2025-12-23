import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { LocationOn, Email, Phone, Facebook } from "@mui/icons-material";

export default function ConsultingSection() {
  const locations = [
    "Tầng 1 - HA5 - 454 Minh Khai - P. Vĩnh Tuy - TP. Hà Nội",
    "Tầng 2 - HA10 - 218 Lĩnh Nam - P. Hoàng Mai - TP. Hà Nội",
    "Tòa Thư viện - 353 Trần Hưng Đạo - P. Nam Định - Tỉnh Ninh Bình",
  ];

  const contacts = [
    { name: "Mr Trần Kính Hoàng", phone: "0869.995.472" },
    { name: "Mr Lê Văn Huy", phone: "0973.105.669" },
    { name: "Mr Tạ Hữu Anh Bình", phone: "0945.579.624" },
  ];

  return (
    <Box id="consulting">
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 3,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          color: "text.primary",
        }}
      >
        Tư vấn thông tin
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}
      >
        Thư viện HBH xây dựng Dịch vụ tư vấn thông tin nhằm nâng cao chất lượng
        công tác phục vụ và hỗ trợ Bạn đọc trong quá trình học tập, nghiên cứu
        tại Trường. Đây là dịch vụ định hướng các nguồn thông tin, giải đáp các
        thắc mắc của Bạn đọc. Bạn đọc có thể đề xuất các vấn đề cần tư vấn bằng
        hình thức trực tiếp hoặc trực tuyến (online), Thư viện sẽ sắp xếp để tư
        vấn kịp thời.
      </Typography>

      <Grid container spacing={3}>
        {/* Locations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Địa điểm tiếp đón
              </Typography>
            </Box>
            <Stack spacing={2}>
              {locations.map((location, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  • {location}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Contact Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Phone sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Liên hệ
              </Typography>
            </Box>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  thuvien@hbh.libsys.me
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Facebook fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Fanpage
                </Typography>
              </Box>
              {contacts.map((contact, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  {contact.name} - {contact.phone}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
