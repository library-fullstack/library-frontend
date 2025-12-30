import React, { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import ForumSettingsPanel from "./ForumSettingsPanel";

export default function ForumSettingsPage() {
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
        <ForumSettingsPanel />
      </Suspense>
    </Box>
  );
}
