import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import type { DatabaseMetrics } from "./types";

interface DatabasePoolGaugeProps {
  database: DatabaseMetrics;
}

export default function DatabasePoolGauge({
  database,
}: DatabasePoolGaugeProps) {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Kết nối Database
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
          }}
        >
          <Gauge
            value={database.utilizationPercent}
            valueMin={0}
            valueMax={100}
            width={220}
            height={220}
            startAngle={-110}
            endAngle={110}
            text={({ value }) => `${value}%`}
            sx={{
              [`& .MuiGauge-valueArc`]: {
                fill:
                  database.utilizationPercent > 80
                    ? theme.palette.error.main
                    : database.utilizationPercent > 60
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
                filter: "drop-shadow(0px 3px 8px rgba(0,0,0,0.2))",
              },
              [`& .MuiGauge-referenceArc`]: {
                fill: alpha(theme.palette.text.disabled, 0.1),
              },
              [`& .MuiGauge-valueText`]: {
                fontSize: 32,
                fontWeight: 700,
                fill: theme.palette.text.primary,
              },
            }}
          />
          <Stack spacing={1} sx={{ mt: 2, width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {database.activeConnections} / {database.maxConnections}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Idle
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {database.idleConnections}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Queued
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {database.queuedRequests}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
