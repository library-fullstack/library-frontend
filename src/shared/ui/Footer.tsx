import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  Link,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import Logo from "./icons/Logo";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export default function Footer(): React.ReactElement {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
        color: (theme) => theme.palette.text.secondary,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Grid
          container
          spacing={{ xs: 6, md: 12 }}
          justifyContent="center"
          alignItems="flex-start"
          sx={{
            maxWidth: 1100,
            mx: "auto",
          }}
        >
          {/* cột 1 */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ maxWidth: 350 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Logo sx={{ width: 36, height: "auto" }} />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.primary"
                  sx={{ letterSpacing: 0.3 }}
                >
                  HBH Library
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.7,
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                Hệ thống thư viện điện tử của Trường Đại học HBH. Nơi lưu trữ,
                chia sẻ và kết nối tri thức dành cho sinh viên HBH.
              </Typography>
            </Stack>
          </Grid>

          {/* cột thứ 2 */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ maxWidth: 250 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                Liên kết nhanh
              </Typography>
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Giới thiệu", href: "/about" },
                { label: "Tin tức & Sự kiện", href: "/news" },
                { label: "Tra cứu sách", href: "/book" },
                { label: "Diễn đàn sinh viên", href: "/forum" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  underline="none"
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: "0.9rem",
                    transition: "0.25s",
                    "&:hover": { color: (theme) => theme.palette.primary.main },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* cột thứ 3 s*/}
          <Grid size={{ xs: 12, md: 4 }} sx={{ maxWidth: 350 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                Liên hệ
              </Typography>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <EmailOutlinedIcon
                  sx={{ fontSize: 20, color: "primary.main" }}
                />
                <Typography variant="body2">
                  <Link
                    href="mailto:library@hbh.libsys.me"
                    underline="hover"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      "&:hover": {
                        color: (theme) => theme.palette.primary.main,
                      },
                    }}
                  >
                    library@hbh.libsys.me
                  </Link>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <LocationOnOutlinedIcon
                  sx={{ fontSize: 20, color: "primary.main" }}
                />
                <Typography variant="body2">
                  419/17/16 Vĩnh Hưng, Hoàng Mai, Hà Nội - Trường ĐH HBH
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        {/* phần bản quyền*/}
        <Divider sx={{ my: { xs: 3, md: 4 } }} />{" "}
        <Typography
          component={motion.p}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          variant="body2"
          textAlign="center"
          sx={{
            color: (theme) => theme.palette.text.secondary,
            fontSize: "0.8rem",
            lineHeight: 1.6,
          }}
        >
          © {new Date().getFullYear()} HBH Library System - Developed by{" "}
          <Box
            component="a"
            href="https://github.com/hoaug-tran"
            target="_blank"
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Trần Kính Hoàng / hoaug
          </Box>{" "}
          & Team 2 - DHMT17A1HN.
        </Typography>
      </Container>
    </Box>
  );
}
