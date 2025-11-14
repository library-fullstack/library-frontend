import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  _threshold?: number;
  children?: React.ReactNode;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export const InfiniteScroll = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>(
  (
    {
      onLoadMore,
      isLoading = false,
      hasNextPage = true,
      _threshold = 500,
      children,
      loader,
      endMessage,
    },
    forwardedRef
  ) => {
    const { ref: sentinelRef, inView } = useInView({
      threshold: 0.1,
    });

    useEffect(() => {
      if (inView && hasNextPage && !isLoading) {
        onLoadMore();
      }
    }, [inView, hasNextPage, isLoading, onLoadMore]);

    return (
      <div ref={forwardedRef}>
        {children}

        <div
          ref={sentinelRef}
          style={{
            height: "20px",
            margin: "20px 0",
            visibility: "hidden",
          }}
        />

        {isLoading && hasNextPage && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            {loader || <p>Đang tải thêm...</p>}
          </div>
        )}

        {!hasNextPage && (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            {endMessage || <p>Đã tải toàn bộ dữ liệu</p>}
          </div>
        )}
      </div>
    );
  }
);

InfiniteScroll.displayName = "InfiniteScroll";

export default InfiniteScroll;
