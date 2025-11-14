import { useState, useCallback, useEffect } from "react";
import { imageOptimizationService } from "../lib/imageOptimizationService";
import logger from "../lib/logger";

export interface UseImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  onSuccess?: (blob: Blob, ratio: number) => void;
  onError?: (error: Error) => void;
}

export function useImageOptimization(
  options: UseImageOptimizationOptions = {}
) {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 80,
    onSuccess,
    onError,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const compress = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("File is not an image");
        }

        logger.info("[Image] Compressing:", file.name, file.size);
        setProgress(30);

        const compressed = await imageOptimizationService.compressImage(file, {
          maxWidth,
          maxHeight,
          quality,
        });

        setProgress(80);

        const ratio = imageOptimizationService.getCompressionRatio(
          file.size,
          compressed.size
        );

        logger.info(
          "[Image] Compression complete:",
          `${imageOptimizationService.formatFileSize(
            file.size
          )} → ${imageOptimizationService.formatFileSize(
            compressed.size
          )} (${ratio}% reduction)`
        );

        setProgress(100);

        onSuccess?.(compressed, ratio);

        return { blob: compressed, ratio };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error("[Image] Compression failed:", error);
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [maxWidth, maxHeight, quality, onSuccess, onError]
  );

  const lazyLoadImage = useCallback((imgElement: HTMLImageElement) => {
    imageOptimizationService.lazyLoadImage(imgElement);
  }, []);

  const preloadImage = useCallback(
    async (imageUrl: string) => {
      try {
        await imageOptimizationService.preloadImage(imageUrl);
        logger.info("[Image] Preloaded:", imageUrl);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error("[Image] Preload failed:", error);
        onError?.(error);
      }
    },
    [onError]
  );

  return {
    compress,
    lazyLoadImage,
    preloadImage,
    isLoading,
    error,
    progress,
  };
}

export function useOptimizedAvatar(originalUrl: string) {
  const getSmall = useCallback(
    () => imageOptimizationService.getOptimizedAvatarUrl(originalUrl, "small"),
    [originalUrl]
  );

  const getMedium = useCallback(
    () => imageOptimizationService.getOptimizedAvatarUrl(originalUrl, "medium"),
    [originalUrl]
  );

  const getLarge = useCallback(
    () => imageOptimizationService.getOptimizedAvatarUrl(originalUrl, "large"),
    [originalUrl]
  );

  return {
    small: getSmall(),
    medium: getMedium(),
    large: getLarge(),
  };
}

export function useWebPSupport() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await imageOptimizationService.isWebPSupported();
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  return isSupported;
}
