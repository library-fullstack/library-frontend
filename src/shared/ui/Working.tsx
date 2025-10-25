import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HelmetIcon from "../../assets/img/working.png";

const MotionBox = motion.create(Box);

// trang working nếu đến page chưa làm
export default function Working(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 134px)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          theme.palette.mode === "light" ? "#FFF8E7" : "#1B1C22",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s ease",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "15%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.06)",
          filter: "blur(70px)",
          animation: "float 7s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-25px)" },
          },
        }}
      />

      {/* Nội dung */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          textAlign: "center",
          color: (theme) =>
            theme.palette.mode === "light" ? "#1B1C22" : "white",
          zIndex: 1,
          px: 3,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ display: "flex", justifyContent: "center", mb: 3 }}
        >
          <Box
            component="img"
            src={HelmetIcon}
            alt="Working Icon"
            sx={{
              width: { xs: 150, md: 200 },
              height: "auto",
              filter: (theme) =>
                theme.palette.mode === "light"
                  ? "drop-shadow(0 10px 25px rgba(0,0,0,0.15))"
                  : "drop-shadow(0 10px 25px rgba(255,255,255,0.1))",
            }}
          />
        </MotionBox>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
          }}
        >
          Trang đang được xây dựng
        </Typography>

        <Typography
          variant="h6"
          sx={{
            opacity: 0.85,
            maxWidth: "600px",
            mx: "auto",
            fontWeight: 400,
            fontSize: { xs: "1rem", md: "1.2rem" },
            mb: 4,
          }}
        >
          Chúng tôi đang hoàn thiện nội dung này để mang đến trải nghiệm tốt
          nhất. Hãy quay lại sau nhé!
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "#ffb703"
                : "rgba(255,255,255,0.9)",
            color: (theme) =>
              theme.palette.mode === "light" ? "#1B1C22" : "#1B1C22",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 1,
            fontSize: "1rem",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "#ff9f00"
                  : "rgba(255,255,255,0.8)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Quay về trang chủ
        </Button>
      </MotionBox>
    </Box>
  );
}
