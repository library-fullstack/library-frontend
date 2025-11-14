import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import type { CacheMetrics } from "./types";

interface CacheStatsPieChartProps {
  cache: CacheMetrics;
}

export default function CacheStatsPieChart({ cache }: CacheStatsPieChartProps) {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Thống kê Cache
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: cache.hits,
                    label: "Trúng",
                    color: theme.palette.success.main,
                  },
                  {
                    id: 1,
                    value: cache.misses,
                    label: "Trượt",
                    color: theme.palette.warning.main,
                  },
                  {
                    id: 2,
                    value: cache.errors,
                    label: "Lỗi",
                    color: theme.palette.error.main,
                  },
                ],
                highlightScope: {
                  faded: "global",
                  highlighted: "item",
                },
                arcLabel: (item) => `${item.value}`,
                arcLabelMinAngle: 35,
                innerRadius: 60,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            height={240}
            margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 0,
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 6,
                itemGap: 16,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
