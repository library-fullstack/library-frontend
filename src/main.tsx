import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AliveScope } from "react-activation";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { BannerProvider } from "./context/BannerContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
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
    </HelmetProvider>
  </ErrorBoundary>
);

// idk, liệu có cần nó không ?
window.history.scrollRestoration = "manual";
