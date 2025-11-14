const isDevelopment = import.meta.env.MODE === "development";

const SENSITIVE_KEYS = new Set([
  "id",
  "userId",
  "user_id",
  "email",
  "phone",
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "full_name",
  "avatar_url",
  "student_id",
  "faculty",
  "major",
  "class_name",
  "admission_year",
  "created_at",
  "updated_at",
  "config",
  "headers",
]);

const sanitizeData = (data: unknown, depth = 0): unknown => {
  if (depth > 3) return "[Circular]";

  if (data === null || data === undefined) return data;

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.length > 10
        ? `[Array(${data.length}) - truncated]`
        : data.map((item) => sanitizeData(item, depth + 1));
    }

    const obj = data as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        if (typeof value === "string" && value.length > 0) {
          const start = Math.min(3, Math.floor(value.length / 3));
          const maskedValue =
            value.substring(0, start) +
            "*".repeat(Math.max(3, value.length - start));
          sanitized[key] = maskedValue;
        } else {
          sanitized[key] = "[REDACTED]";
        }
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeData(value, depth + 1);
      } else if (typeof value === "string" && value.length > 200) {
        sanitized[key] = value.substring(0, 200) + "... [truncated]";
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  return data;
};

const formatLogMessage = (
  prefix: string,
  args: unknown[]
): [string, ...unknown[]] => {
  const sanitizedArgs = args.map((arg) => {
    if (typeof arg === "object") {
      return sanitizeData(arg);
    }
    return arg;
  });

  return [prefix, ...sanitizedArgs];
};

export const logger = {
  log: (prefix: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...formatLogMessage(prefix, args));
    }
  },

  error: (prefix: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.error(...formatLogMessage(prefix, args));
    }
  },

  warn: (prefix: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...formatLogMessage(prefix, args));
    }
  },

  info: (prefix: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.info(...formatLogMessage(prefix, args));
    }
  },

  debug: (prefix: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...formatLogMessage(prefix, args));
    }
  },
};

export default logger;
