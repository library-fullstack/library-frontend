import { useLayoutEffect, useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollMemory() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const ticking = useRef(false);
  const restored = useRef(false);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history)
      window.history.scrollRestoration = "manual";

    const key = `${location.key}|${location.pathname}${location.search}`;

    restored.current = false;

    // reset scroll
    if (navigationType !== "POP") {
      window.scrollTo(0, 0);
      restored.current = true;
    }

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        sessionStorage.setItem(key, String(window.scrollY));
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location, navigationType]);

  useEffect(() => {
    if (navigationType !== "POP" || restored.current) return;

    const key = `${location.key}|${location.pathname}${location.search}`;
    const savedY = sessionStorage.getItem(key);
    const y = savedY ? parseInt(savedY, 10) : 0;

    if (y === 0) return;

    const tryRestore = () => {
      const maxY = document.body.scrollHeight - window.innerHeight;
      if (maxY < y - 20) {
        requestAnimationFrame(tryRestore);
        return;
      }
      window.scrollTo(0, y);
      restored.current = true;
    };

    requestAnimationFrame(tryRestore);
  }, [location, navigationType]);

  return null;
}
