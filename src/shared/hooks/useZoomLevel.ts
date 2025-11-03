import { useState, useEffect } from "react";

export function useZoomLevel() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const detectZoom = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const zoom = Math.round(devicePixelRatio * 100);
      setZoomLevel(zoom);
      setIsZoomed(zoom > 105);
    };

    detectZoom();

    window.addEventListener("resize", detectZoom);

    window.addEventListener("orientationchange", detectZoom);

    const interval = setInterval(detectZoom, 1000);

    return () => {
      window.removeEventListener("resize", detectZoom);
      window.removeEventListener("orientationchange", detectZoom);
      clearInterval(interval);
    };
  }, []);

  return { zoomLevel, isZoomed };
}
