import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import type { PerformanceMetrics } from "./types";

interface SlowEndpointsChartProps {
  performance: PerformanceMetrics;
}

export default function SlowEndpointsChart({
  performance,
}: SlowEndpointsChartProps) {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Endpoints chậm nhất
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {performance.topSlowEndpoints &&
        performance.topSlowEndpoints.length > 0 ? (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: performance.topSlowEndpoints.slice(0, 5).map((e) => {
                  const parts = e.endpoint.split(" ");
                  return parts[1]?.split("/").pop() || e.endpoint;
                }),
                label: "Endpoint",
              },
            ]}
            yAxis={[
              {
                label: "ms",
              },
            ]}
            series={[
              {
                data: performance.topSlowEndpoints
                  .slice(0, 5)
                  .map((e) => e.avgDuration),
                label: "Thời gian TB",
                color: theme.palette.warning.main,
              },
            ]}
            height={280}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            grid={{ horizontal: true }}
            borderRadius={8}
            sx={{
              ".MuiBarElement-root": {
                filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.15))",
              },
              ".MuiBarElement-root:hover": {
                opacity: 0.8,
                transition: "opacity 0.2s ease-in-out",
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 10 }}
          >
            Chưa có dữ liệu
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
