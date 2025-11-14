import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { PerformanceHistory } from "./types";

interface PerformanceTrendChartProps {
  history: PerformanceHistory[];
}

export default function PerformanceTrendChart({
  history,
}: PerformanceTrendChartProps) {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Xu hướng hiệu suất
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {history.length > 0 ? (
          <LineChart
            xAxis={[
              {
                data: history.map((_, i) => i),
                scaleType: "point",
                tickMinStep: 1,
              },
            ]}
            yAxis={[
              {
                label: "Thời gian (ms)",
              },
            ]}
            series={[
              {
                data: history.map((h) => h.maxDuration),
                label: "Tối đa",
                color: "#f59e0b",
                curve: "catmullRom",
                showMark: false,
                area: false,
              },
              {
                data: history.map((h) => h.avgDuration),
                label: "Trung bình",
                color: "#3b82f6",
                curve: "catmullRom",
                showMark: false,
                area: false,
              },
              {
                data: history.map((h) => h.minDuration),
                label: "Tối thiểu",
                color: "#ef4444",
                curve: "catmullRom",
                showMark: false,
                area: false,
              },
            ]}
            height={320}
            margin={{ top: 20, right: 20, bottom: 70, left: 70 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 0,
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 6,
                itemGap: 20,
              },
            }}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.02),
              ".MuiLineElement-root": {
                strokeWidth: 2.5,
              },
              ".MuiChartsGrid-line": {
                strokeDasharray: "3 3",
                stroke: alpha(theme.palette.divider, 0.3),
              },
              ".MuiChartsAxis-line": {
                stroke: alpha(theme.palette.divider, 0.5),
              },
              ".MuiChartsAxis-tick": {
                stroke: alpha(theme.palette.divider, 0.5),
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
            Đang chờ dữ liệu...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
