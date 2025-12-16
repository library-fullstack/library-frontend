import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ModerationReports from "../../features/forum/components/ModerationReports";

export default function ForumReportsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
    </Container>
  );
}
