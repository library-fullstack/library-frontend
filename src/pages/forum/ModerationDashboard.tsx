import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import ModerationDashboard from "../../features/forum/components/ModerationDashboard";

const ModerationDashboardPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      <ModerationDashboard />
    </Suspense>
  );
};

export default ModerationDashboardPage;
