import React from "react";
import { Box, BoxProps } from "@mui/material";

interface OptimizedImageProps extends Omit<BoxProps, "component"> {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
  onError,
  sx,
  ...boxProps
}: OptimizedImageProps): React.ReactElement {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={onError}
      decoding="async"
      sx={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
        ...sx,
      }}
      {...boxProps}
    />
  );
}
