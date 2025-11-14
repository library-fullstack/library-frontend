export interface CacheMetrics {
  hits: number;
  misses: number;
  errors: number;
  total: number;
  hitRate: string;
}

export interface DatabaseMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  queuedRequests: number;
  maxConnections: number;
  maxIdle: number;
  utilizationPercent: number;
}

export interface PerformanceMetrics {
  summary: {
    totalRequests: number;
    avgDuration: number;
    totalDuration: number;
  };
  topSlowEndpoints: Array<{
    endpoint: string;
    count: number;
    avgDuration: number;
  }>;
}

export interface AllMetrics {
  cache: CacheMetrics;
  database: DatabaseMetrics;
  performance: PerformanceMetrics;
}

export interface HealthData {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  checks: {
    database: { status: string; message?: string };
    cache: { status: string; message?: string };
  };
}

export interface PerformanceHistory {
  time: string;
  requests: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  hitRate: number;
}
