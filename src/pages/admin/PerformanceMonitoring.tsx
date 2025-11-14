import React, { useState, useEffect } from "react";
import {
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Refresh } from "@mui/icons-material";
import axiosClient from "@/shared/api/axiosClient";
import logger from "@/shared/lib/logger";
import {
  OverviewCards,
  PerformanceTrendChart,
  DatabasePoolGauge,
  CacheStatsPieChart,
  SlowEndpointsChart,
  HealthStatusChip,
  type AllMetrics,
  type PerformanceHistory,
} from "@/features/admin/performance";

interface HealthData {
  success: boolean;
  status: "healthy" | "degraded" | "unhealthy";
  data: {
    cache: {
      hitRate: string;
      totalRequests: number;
    };
    database: {
      activeConnections: number;
      utilizationPercent: number;
    } | null;
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    timestamp: string;
  };
}

interface HealthDataCompat {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  checks: {
    database: { status: string; message?: string };
    cache: { status: string; message?: string };
  };
}

export default function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<AllMetrics | null>(null);
  const [health, setHealth] = useState<HealthDataCompat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PerformanceHistory[]>([]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, healthRes] = await Promise.all([
        axiosClient.get<{ success: boolean; data: AllMetrics }>("/metrics/all"),
        axiosClient.get<HealthData>("/metrics/health"),
      ]);

      setMetrics(metricsRes.data.data);

      const healthData = healthRes.data;
      setHealth({
        status: healthData.status,
        uptime: healthData.data.uptime,
        timestamp: healthData.data.timestamp,
        checks: {
          database: { status: "healthy" },
          cache: { status: "healthy" },
        },
      });

      setHistory((prev) => {
        const summary = metricsRes.data.data.performance.summary;
        const topEndpoints =
          metricsRes.data.data.performance.topSlowEndpoints || [];
        const avgDur = summary.avgDuration;
        const newEntry: PerformanceHistory = {
          time: new Date().toLocaleTimeString(),
          requests: summary.totalRequests,
          avgDuration: avgDur,
          minDuration:
            topEndpoints.length > 0
              ? Math.min(...topEndpoints.map((e) => e.avgDuration))
              : avgDur * 0.5,
          maxDuration:
            topEndpoints.length > 0
              ? Math.max(...topEndpoints.map((e) => e.avgDuration))
              : avgDur * 1.5,
          hitRate: parseFloat(metricsRes.data.data.cache.hitRate),
        };
        const updated = [...prev, newEntry].slice(-20);
        return updated;
      });
    } catch (err) {
      logger.error("Error fetching metrics:", err);
      setError("Không thể tải metrics. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
        <Box sx={{ px: { xs: 0, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" gutterBottom>
            Giám sát hiệu suất
          </Typography>
          <LinearProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
        <Box sx={{ px: { xs: 0, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 0, sm: 3 },
          pt: { xs: 2, sm: 3 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
          >
            Giám sát hiệu suất
          </Typography>
          <HealthStatusChip health={health} />
        </Box>
        <Tooltip title="Làm mới">
          <IconButton
            onClick={fetchMetrics}
            disabled={loading}
            aria-label="Làm mới metrics"
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ px: { xs: 0, sm: 3 } }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <OverviewCards metrics={metrics} />

          <Grid size={{ xs: 12, lg: 8 }}>
            <PerformanceTrendChart history={history} />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            {metrics?.database && (
              <DatabasePoolGauge database={metrics.database} />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {metrics?.cache && <CacheStatsPieChart cache={metrics.cache} />}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {metrics?.performance && (
              <SlowEndpointsChart performance={metrics.performance} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
