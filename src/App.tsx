import React from "react";
import AppRoutes from "./app/routes/AppRoutes";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <AppRoutes />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
