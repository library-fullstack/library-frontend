import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import Logo from "./icons/Logo";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Facebook } from "lucide-react";
import { Link, useNavigationType } from "react-router-dom";

export default function Footer(): React.ReactElement {
  const navigationType = useNavigationType();
  const shouldAnimate = navigationType !== "POP";

  const quickLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Giới thiệu", path: "/about" },
    { label: "Tin tức & Sự kiện", path: "/news" },
    { label: "Tra cứu sách", path: "/catalog" },
    { label: "Diễn đàn", path: "/forum" },
  ];

  const contactInfo = [
    {
      icon: <EmailOutlinedIcon sx={{ fontSize: 18 }} />,
      text: "library@hbh.libsys.me",
    },
    {
      icon: <PhoneOutlinedIcon sx={{ fontSize: 18 }} />,
      text: "(086) 999 5472",
    },
    {
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />,
      text: "419 Đ. Lĩnh Nam, Vĩnh Hưng, Hoàng Mai, Hà Nội",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Logo */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "center" },
                height: "100%",
              }}
            >
              <Logo width={90} />
            </Box>
          </Grid>

          {/* Column 2: Info */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              Thư viện HBH
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.7 }}
            >
              Nơi hội tụ tri thức, kết nối cộng đồng yêu sách và học tập Trường
              Đại học HBH.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  color: "primary.main",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                aria-label="Facebook"
                component="a"
                href="https://www.facebook.com/hoaugtr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "primary.main",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                aria-label="YouTube"
                component="a"
                href="https://www.facebook.com/huy.levan.355138"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "primary.main",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                aria-label="Facebook"
                component="a"
                href="https://www.facebook.com/anhbnh2425"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </IconButton>
            </Stack>
          </Grid>

          {/* Column 3: Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              Liên kết nhanh
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  underline="hover"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    "&:hover": { color: "primary.main" },
                    display: "block",
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Column 4: Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              Liên hệ
            </Typography>
            <Stack spacing={1.5}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
                >
                  <Box sx={{ color: "primary.main", mt: 0.25 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {info.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Column 5: Google Map */}
          <Grid size={{ xs: 12, sm: 12, md: 2.4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              Vị trí
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 200,
                borderRadius: 1,
                overflow: "hidden",
                border: 1,
                borderColor: "divider",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6157759!2d105.8774839!3d20.9837105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aea030ef16d7%3A0xd4eb55fd5fb08f7b!2z0JHQuNCx0LvQuNC-0YLQtdC60LAg0JHQkNCd0JrQuNC90LMgdGjhu6Ugdmnhu4duIMSRw6BpIGjhu41jIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2s!4v1734777777777!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí Thư viện HBH"
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        <Typography
          component={motion.p}
          initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          variant="body2"
          textAlign="center"
          sx={{
            color: "text.secondary",
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
              color: "primary.main",
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
