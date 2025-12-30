import React, { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import ModerationReports from "../../features/forum/components/ModerationReports";

export default function ForumReportsPage() {
  return (
    <Box sx={{ pl: 4, marginLeft: 0, marginRight: 0 }}>
      <Suspense
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        }
      >
        <ModerationReports />
      </Suspense>
    </Box>
  );
}
