import * as React from "react";
import { Box, Container, Button } from "@mui/material";
import { Link, useLocation } from "react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

export default function MenuBar(): React.ReactElement {
  const location = useLocation();
  const [hidden, setHidden] = React.useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (latest > previous && latest > 100) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  // nav
  const menuItems = [
    { label: "TRANG CHỦ", path: "/" },
    { label: "DANH MỤC SÁCH", path: "/books" },
    { label: "DỊCH VỤ", path: "/services" },
    { label: "TIN TỨC & SỰ KIỆN", path: "/news" },
    { label: "VỀ CHÚNG TÔI", path: "/about" },
    { label: "LIÊN HỆ", path: "/contact" },
    { label: "DIỄN ĐÀN", path: "/forum" },
  ];

  return (
    <Box
      component={motion.div}
      animate={{
        y: hidden ? -100 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      sx={{
        position: "sticky",
        top: 64,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        py: 0.5,
        zIndex: 999,
        display: { xs: "none", md: "block" },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <React.Fragment key={item.path}>
                <Button
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? "primary.main" : "text.primary",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.80rem",
                      md: "0.85rem",
                      lg: "0.90rem",
                    },
                    textTransform: "none",
                    px: { xs: 2.2, sm: 2.6, md: 3.2 },
                    py: { xs: 1, sm: 1.2 },
                    minWidth: "auto",
                    borderRadius: 1.5,
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "primary.main",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {item.label}
                </Button>
                {index < menuItems.length - 1 && (
                  <Box
                    sx={{
                      width: "1px",
                      height: "16px",
                      bgcolor: "divider",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
