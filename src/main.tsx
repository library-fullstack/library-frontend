import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/fonts.css";

console.log("Application starting...");
console.log("API URL:", import.meta.env.VITE_API_URL);

// Ẩn loading screen sau khi React render xong
const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
      // Xóa hoàn toàn sau khi animation kết thúc
      setTimeout(() => {
        loader.remove();
      }, 400);
    }, 100);
  }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeContextProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Ẩn loader sau khi render
hideInitialLoader();

console.log("Application rendered");
