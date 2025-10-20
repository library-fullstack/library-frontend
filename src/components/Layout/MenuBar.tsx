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

    // scroll xuống và đã scroll qua 100px thì ẩn menubar
    if (latest > previous && latest > 100) {
      setHidden(true);
    }
    // nếu scroll lên thì hiện lại menubar
    else if (latest < previous) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

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
        backgroundColor: "white",
        borderBottom: "1px solid #E0E0E0",
        py: 1,
        zIndex: 999,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
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
                    color: isActive ? "#FF6B6B" : "#333",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.85rem",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#FF6B6B",
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
                      backgroundColor: "#DDD",
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
