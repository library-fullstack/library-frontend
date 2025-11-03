import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme, useMediaQuery } from "@mui/material";

interface MonthlyBarChartProps {
  data: Array<{ month: string; books: number; users: number }>;
}

const MonthlyBarChart = React.memo(({ data }: MonthlyBarChartProps) => {
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
      <BarChart
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
            dataKey: "books",
            label: "Sách mới",
            color: theme.palette.primary.main,
          },
          {
            dataKey: "users",
            label: "User mới",
            color: theme.palette.success.main,
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

MonthlyBarChart.displayName = "MonthlyBarChart";

export default MonthlyBarChart;
