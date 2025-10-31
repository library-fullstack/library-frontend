import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AliveScope } from "react-activation";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <AliveScope>
            <App />
          </AliveScope>
        </BrowserRouter>
      </AuthProvider>
    </ThemeContextProvider>
  </ErrorBoundary>
);

// idk, liệu có cần nó không ?
window.history.scrollRestoration = "manual";
