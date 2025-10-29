import React from "react";
import AppRoutes from "./app/routes/AppRoutes";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default App;
