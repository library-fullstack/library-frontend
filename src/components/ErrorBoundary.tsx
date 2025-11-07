import { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/shared/lib/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("ErrorBoundary caught error:", {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) {
      const isProduction = import.meta.env.PROD;

      return (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            color: "#000",
            minHeight: "100vh",
          }}
        >
          <h1>Something went wrong.</h1>
          <p>We apologize for the inconvenience. Please try refreshing the page.</p>
          {!isProduction && this.state.error && (
            <details style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
              <summary>Error Details (Development Only)</summary>
              {this.state.error.toString()}
              <br />
              {this.state.error.stack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
