import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme, useMediaQuery, Box } from "@mui/material";

interface CategoryPieChartProps {
  data: Array<{ name: string; value: number }>;
}

const CategoryPieChart = React.memo(({ data }: CategoryPieChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  const chartData = data.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.name,
    color: COLORS[index % COLORS.length],
  }));

  // Responsive sizing - tối ưu cho mobile để tránh legend đè lên chart
  const outerRadius = isMobile ? 75 : isTablet ? 80 : 90;
  const chartHeight = isMobile ? 420 : isTablet ? 420 : 420;
  const tickFontSize = isMobile ? 10 : isTablet ? 11 : 12;
  const margin = isMobile
    ? { top: 10, bottom: 120, left: 5, right: 5 }
    : isTablet
    ? { top: 15, bottom: 100, left: 10, right: 10 }
    : { top: 20, bottom: 80, left: 15, right: 15 };

  const legendSlotProps = isMobile
    ? {
        legend: {
          hidden: false,
          direction: "column" as const,
          position: { vertical: "bottom" as const, horizontal: "middle" as const },
          padding: 0,
          itemMarkWidth: 14,
          itemMarkHeight: 14,
          markGap: 5,
          itemGap: 8,
          labelStyle: {
            fontSize: tickFontSize,
            fill: theme.palette.text.primary,
          },
        },
      }
    : isTablet
    ? {
        legend: {
          hidden: false,
          direction: "column" as const,
          position: { vertical: "bottom" as const, horizontal: "middle" as const },
          padding: 5,
          itemMarkWidth: 16,
          itemMarkHeight: 16,
          markGap: 6,
          itemGap: 10,
          labelStyle: {
            fontSize: tickFontSize,
            fill: theme.palette.text.primary,
          },
        },
      }
    : {
        legend: {
          hidden: false,
          direction: "row" as const,
          position: { vertical: "bottom" as const, horizontal: "middle" as const },
          padding: 8,
          itemMarkWidth: 18,
          itemMarkHeight: 18,
          markGap: 8,
          itemGap: 15,
          labelStyle: {
            fontSize: tickFontSize,
            fill: theme.palette.text.primary,
          },
        },
      };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 0,
            outerRadius: outerRadius,
            paddingAngle: 1.5,
            cornerRadius: 3,
          },
        ]}
        height={chartHeight}
        margin={margin}
        slotProps={legendSlotProps}
      />
    </Box>
  );
});

CategoryPieChart.displayName = "CategoryPieChart";

export default CategoryPieChart;
