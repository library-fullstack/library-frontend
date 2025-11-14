import logger from "./logger";

export interface OptimizedImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-100
  format?: "webp" | "jpeg" | "png";
  enableWebP?: boolean;
}

class ImageOptimizationService {
  async compressImage(
    file: File,
    options: OptimizedImageOptions = {}
  ): Promise<Blob> {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 80,
      format = "webp",
      enableWebP = true,
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const img = new Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            const mimeType =
              enableWebP && format === "webp"
                ? "image/webp"
                : format === "jpeg"
                ? "image/jpeg"
                : "image/png";

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  logger.info(
                    "[Image] Compressed from",
                    file.size,
                    "to",
                    blob.size
                  );
                  resolve(blob);
                } else {
                  reject(new Error("Failed to convert canvas to blob"));
                }
              },
              mimeType,
              quality / 100
            );
          };

          img.onerror = () => {
            reject(new Error("Failed to load image"));
          };

          img.src = reader.result as string;
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  generateResponsiveSizes(imageUrl: string): Record<string, string> {
    return {
      "256w": `${imageUrl}?w=256`,
      "512w": `${imageUrl}?w=512`,
      "1024w": `${imageUrl}?w=1024`,
    };
  }

  getOptimizedAvatarUrl(
    originalUrl: string,
    size: "small" | "medium" | "large" = "medium"
  ): string {
    const sizes = {
      small: 64,
      medium: 128,
      large: 256,
    };

    const pixelSize = sizes[size];

    return `${originalUrl}?w=${pixelSize}&h=${pixelSize}&format=webp`;
  }

  lazyLoadImage(imgElement: HTMLImageElement): void {
    if (!("IntersectionObserver" in window)) {
      imgElement.src = imgElement.dataset.src || "";
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    observer.observe(imgElement);
  }

  preloadImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () =>
        reject(new Error(`Failed to load image: ${imageUrl}`));
      img.src = imageUrl;
    });
  }

  async isWebPSupported(): Promise<boolean> {
    const webP = new Image();
    webP.onload = webP.onerror = () => {};
    webP.src =
      "data:image/webp;base64,UklGRjoIAABXRUJQVlA4IC4IAAAAAP4AOCEX/gX+DwEP/gX+DwEP";
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(webP.height === 1);
      }, 100);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  getCompressionRatio(originalSize: number, compressedSize: number): number {
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  }
}

export const imageOptimizationService = new ImageOptimizationService();
