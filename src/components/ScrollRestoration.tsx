import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const key = `scroll-${pathname}`;
    const saved = sessionStorage.getItem(key);
    if (saved) window.scrollTo(0, parseInt(saved));

    const handler = () =>
      sessionStorage.setItem(key, window.scrollY.toString());
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [pathname]);

  return null;
}
