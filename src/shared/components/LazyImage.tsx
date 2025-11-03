import { ImgHTMLAttributes, useState, useEffect, useRef } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  onLoad?: () => void;
}

export default function LazyImage({
  src,
  alt,
  placeholderSrc,
  onLoad,
  className,
  style,
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(!placeholderSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imageSrc !== src) {
          setImageSrc(src);
          observer.unobserve(img);
        }
      },
      {
        rootMargin: "50px",
      }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, [imageSrc, src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0.7,
        transition: "opacity 0.3s ease-in-out",
      }}
      onLoad={handleImageLoad}
      {...props}
    />
  );
}
