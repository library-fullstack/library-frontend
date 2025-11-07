import React, { useState, useEffect, useRef, useCallback } from "react";
import { TextField, TextFieldProps } from "@mui/material";

interface DebouncedColorPickerProps extends Omit<TextFieldProps, "onChange" | "type"> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedColorPicker: React.FC<DebouncedColorPickerProps> = ({
  value,
  onChange,
  debounceMs = 100,
  ...textFieldProps
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          onChange(newValue);
        }
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  return (
    <TextField
      {...textFieldProps}
      type="color"
      value={localValue}
      onChange={handleChange}
    />
  );
};
