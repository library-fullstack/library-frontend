import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ModerationActivityLogs from "../../features/forum/components/ModerationActivityLogs";

export default function ForumActivityLogsPage() {
  return (
    <Container maxWidth="lg" sx={{ marginLeft: 0, marginRight: 0 }}>
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
        <ModerationActivityLogs />
      </Suspense>
    </Container>
  );
}
