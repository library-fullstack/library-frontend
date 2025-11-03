import React from "react";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";

interface BookInfoCardProps {
  label: string;
  value: string;
  onClick?: () => void;
}

export default function BookInfoCard({
  label,
  value,
  onClick,
}: BookInfoCardProps): React.ReactElement {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: 1,
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(79, 70, 229, 0.15)"
                  : "0 4px 12px rgba(129, 140, 248, 0.2)",
              borderColor: "primary.main",
              transform: "translateY(-2px)",
            }
          : {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(79, 70, 229, 0.15)"
                  : "0 4px 12px rgba(129, 140, 248, 0.2)",
              borderColor: "primary.main",
            },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem", fontWeight: 600 }}
            >
              {label}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
