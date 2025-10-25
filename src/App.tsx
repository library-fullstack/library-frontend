import React from "react";
import AppRoutes from "./app/routes/AppRoutes";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <SpeedInsights />
    </>
  );
};

export default App;
