import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useEventEffectsSetting } from "../hooks/useEventEffectsSetting";
import logger from "@/shared/lib/logger";

interface FallingElementConfig {
  count: number;
  duration: { min: number; max: number };
  delay: { min: number; max: number };
  size: { min: number; max: number };
  opacity: { min: number; max: number };
  colors: string[];
  symbol?: string;
  style?: "particle" | "leaf" | "snowflake" | "heart";
}

const ALLOWED_EVENT_TYPES = [
  "halloween",
  "christmas",
  "tet",
  "valentine",
  "summer",
  "backtoschool",
  "spring",
  "blackfriday",
  "newyear",
  "default",
] as const;

type AllowedEventType = (typeof ALLOWED_EVENT_TYPES)[number];

const isValidEventType = (eventType: string): eventType is AllowedEventType => {
  return ALLOWED_EVENT_TYPES.includes(
    eventType.toLowerCase() as AllowedEventType
  );
};

const defaultConfigs: Record<string, FallingElementConfig> = {
  halloween: {
    count: 15,
    duration: { min: 8, max: 15 },
    delay: { min: 0, max: 5 },
    size: { min: 8, max: 18 },
    opacity: { min: 0.4, max: 0.9 },
    colors: ["#ffa500", "#ff8c00", "#ed553b"],
    symbol: "🍂",
    style: "leaf",
  },
  christmas: {
    count: 20,
    duration: { min: 10, max: 18 },
    delay: { min: 0, max: 3 },
    size: { min: 6, max: 14 },
    opacity: { min: 0.5, max: 1 },
    colors: ["#ffffff", "#e0f2fe"],
    symbol: "❄",
    style: "snowflake",
  },
  tet: {
    count: 12,
    duration: { min: 6, max: 12 },
    delay: { min: 0, max: 4 },
    size: { min: 10, max: 16 },
    opacity: { min: 0.6, max: 1 },
    colors: ["#ffd700", "#dc2626", "#f59e0b"],
    symbol: "✨",
    style: "particle",
  },
  valentine: {
    count: 18,
    duration: { min: 12, max: 20 },
    delay: { min: 0, max: 6 },
    size: { min: 12, max: 20 },
    opacity: { min: 0.4, max: 0.8 },
    colors: ["#ec4899", "#f472b6", "#fce7f3"],
    symbol: "❤",
    style: "heart",
  },
  summer: {
    count: 10,
    duration: { min: 15, max: 25 },
    delay: { min: 0, max: 8 },
    size: { min: 20, max: 32 },
    opacity: { min: 0.3, max: 0.7 },
    colors: ["#fbbf24", "#f59e0b", "#fef3c7"],
    symbol: "☀",
    style: "particle",
  },
  backtoschool: {
    count: 14,
    duration: { min: 9, max: 16 },
    delay: { min: 0, max: 5 },
    size: { min: 14, max: 22 },
    opacity: { min: 0.5, max: 0.85 },
    colors: ["#3b82f6", "#60a5fa", "#dbeafe"],
    symbol: "📚",
    style: "particle",
  },
  spring: {
    count: 16,
    duration: { min: 11, max: 18 },
    delay: { min: 0, max: 6 },
    size: { min: 12, max: 20 },
    opacity: { min: 0.4, max: 0.8 },
    colors: ["#10b981", "#34d399", "#d1fae5"],
    symbol: "🌸",
    style: "leaf",
  },
  blackfriday: {
    count: 12,
    duration: { min: 8, max: 14 },
    delay: { min: 0, max: 4 },
    size: { min: 16, max: 24 },
    opacity: { min: 0.6, max: 1 },
    colors: ["#fbbf24", "#f59e0b", "#000000"],
    symbol: "⚡",
    style: "particle",
  },
  newyear: {
    count: 18,
    duration: { min: 7, max: 13 },
    delay: { min: 0, max: 5 },
    size: { min: 10, max: 18 },
    opacity: { min: 0.5, max: 0.9 },
    colors: ["#f59e0b", "#3b82f6", "#ec4899"],
    symbol: "🎆",
    style: "particle",
  },
};

interface Props {
  eventType?: string;
  containerId?: string;
}

export const EventFallingElements: React.FC<Props> = ({
  eventType,
  containerId = "event-falling-container",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const isMobileRef = useRef(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const isEffectsEnabled = useEventEffectsSetting();

  useEffect(() => {
    if (!eventType || !containerRef.current) return;
    const container = containerRef.current;

    if (!isEffectsEnabled) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      initRef.current = false;
      return;
    }

    if (initRef.current) return;

    const normalizedEventType = eventType.toLowerCase();

    if (!isValidEventType(normalizedEventType)) {
      logger.warn(
        `Invalid event type: ${eventType}. Allowed types are: ${ALLOWED_EVENT_TYPES.join(
          ", "
        )}`
      );
      return;
    }

    const config = defaultConfigs[normalizedEventType];
    if (!config) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const style = document.createElement("style");
    style.textContent = generateAnimationCSS(normalizedEventType, config);
    container.appendChild(style);

    const count = isMobileRef.current
      ? Math.floor(config.count / 2)
      : config.count;
    const elements = createFallingElements(
      { ...config, count },
      normalizedEventType
    );
    elements.forEach((el) => container.appendChild(el));

    initRef.current = true;
  }, [eventType, isEffectsEnabled]);

  return (
    <Box
      ref={containerRef}
      id={containerId}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    />
  );
};

function generateAnimationCSS(
  theme: string,
  config: FallingElementConfig
): string {
  const animationName = `fall-${theme}`;
  return `
    @keyframes ${animationName} {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      5% {
        opacity: ${config.opacity.max};
      }
      95% {
        opacity: ${config.opacity.max};
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }

    .falling-element {
      position: fixed;
      top: 0;
      pointer-events: none;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      will-change: transform, opacity;
      transform: translateZ(0);
      backface-visibility: hidden;
    }
  `;
}

function createFallingElements(
  config: FallingElementConfig,
  theme: string
): HTMLElement[] {
  const elements: HTMLElement[] = [];

  for (let i = 0; i < config.count; i++) {
    const el = document.createElement("div");
    el.className = "falling-element";
    el.textContent = config.symbol || "•";

    const duration = randomBetween(config.duration.min, config.duration.max);
    const size = randomBetween(config.size.min, config.size.max);
    const left = Math.random() * 100;
    const color =
      config.colors[Math.floor(Math.random() * config.colors.length)];

    const initialDelay = (i / config.count) * (config.duration.max * 0.8);

    Object.assign(el.style, {
      left: `${left}%`,
      fontSize: `${size}px`,
      color,
      animation: `fall-${theme} ${duration}s linear ${initialDelay}s infinite`,
    });

    elements.push(el);
  }

  return elements;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export default EventFallingElements;
