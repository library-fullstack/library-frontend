import { useEffect, useState } from "react";

// trì hoãn cập nhật giá trị để tránh xử lý/gọi API quá thường xuyên gây chậm và lag
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
