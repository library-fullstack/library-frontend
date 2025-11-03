import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme, useMediaQuery } from "@mui/material";

interface TrendChartProps {
  data: Array<{ month: string; borrows: number; returns: number }>;
}

const TrendChart = React.memo(({ data }: TrendChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartHeight = isMobile ? 280 : isTablet ? 320 : 360;
  const tickFontSize = isMobile ? 10 : isTablet ? 11 : 12;
  const legendFontSize = isMobile ? 11 : isTablet ? 12 : 13;
  const margin = isMobile
    ? { left: 40, right: 10, top: 15, bottom: 50 }
    : isTablet
    ? { left: 50, right: 15, top: 20, bottom: 55 }
    : { left: 60, right: 20, top: 25, bottom: 60 };

  return (
    <div style={{ width: "100%", height: chartHeight }}>
      <LineChart
        dataset={data}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
            tickLabelStyle: {
              fontSize: tickFontSize,
              fill: theme.palette.text.secondary,
            },
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: {
              fontSize: tickFontSize,
              fill: theme.palette.text.secondary,
            },
          },
        ]}
        series={[
          {
            dataKey: "borrows",
            label: "Lượt mượn",
            color: theme.palette.primary.main,
            curve: "catmullRom",
          },
          {
            dataKey: "returns",
            label: "Lượt trả",
            color: theme.palette.success.main,
            curve: "catmullRom",
          },
        ]}
        margin={margin}
        slotProps={{
          legend: {
            direction: isMobile ? "row" : "row",
            position: { vertical: "bottom", horizontal: "middle" },
            padding: isMobile ? 0 : 5,
            itemMarkWidth: isMobile ? 12 : 15,
            itemMarkHeight: isMobile ? 12 : 15,
            markGap: isMobile ? 4 : 5,
            itemGap: isMobile ? 8 : 12,
            labelStyle: {
              fontSize: legendFontSize,
              fill: theme.palette.text.primary,
            },
          },
        }}
        sx={{
          "& .MuiLineElement-root": {
            strokeWidth: 2,
          },
          "& .MuiChartsLegend-root": {
            transform: isMobile
              ? "translateY(-10px)"
              : isTablet
              ? "translateY(-8px)"
              : "translateY(-5px)",
          },
        }}
      />
    </div>
  );
});

TrendChart.displayName = "TrendChart";

export default TrendChart;
