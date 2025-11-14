import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AliveScope } from "react-activation";
import { HelmetProvider } from "react-helmet-async";
import { QueryProvider } from "./shared/lib/react-query";
import AuthProvider from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { BannerProvider } from "./context/BannerContext";
import { LoadingStateProvider } from "./context/LoadingStateContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
      <QueryProvider>
        <LoadingStateProvider>
          <ThemeContextProvider>
            <BannerProvider>
              <AuthProvider>
                <BrowserRouter>
                  <AliveScope>
                    <App />
                  </AliveScope>
                </BrowserRouter>
              </AuthProvider>
            </BannerProvider>
          </ThemeContextProvider>
        </LoadingStateProvider>
      </QueryProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

// idk, liệu có cần nó không ?
window.history.scrollRestoration = "manual";
