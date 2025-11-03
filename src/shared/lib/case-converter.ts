const parseDateString = (dateStr: unknown): Date | string => {
  if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(`${dateStr}T00:00:00Z`);
    return date;
  }
  return dateStr as string;
};

export const snakeToCamel = (obj: Record<string, unknown>): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce(
      (result: Record<string, unknown>, key: string) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          (letter as string).toUpperCase()
        );
        const value = obj[key];

        if (
          (camelKey === "startDate" || camelKey === "endDate") &&
          typeof value === "string"
        ) {
          result[camelKey] = parseDateString(value);
        } else if (value !== null && typeof value === "object") {
          result[camelKey] = snakeToCamel(value as Record<string, unknown>);
        } else {
          result[camelKey] = value;
        }
        return result;
      },
      {}
    );
  }
  return obj;
};

export const camelToSnake = (obj: Record<string, unknown>): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce(
      (result: Record<string, unknown>, key: string) => {
        const snakeKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`
        );
        const value = obj[key];

        if (
          (snakeKey === "start_date" || snakeKey === "end_date") &&
          value instanceof Date
        ) {
          result[snakeKey] = value.toISOString().split("T")[0];
        } else if (value !== null && typeof value === "object") {
          result[snakeKey] = camelToSnake(value as Record<string, unknown>);
        } else {
          result[snakeKey] = value;
        }
        return result;
      },
      {}
    );
  }
  return obj;
};
