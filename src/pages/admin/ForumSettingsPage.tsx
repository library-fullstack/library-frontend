import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ForumSettingsPanel from "./ForumSettingsPanel";

export default function ForumSettingsPage() {
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
        <ForumSettingsPanel />
      </Suspense>
    </Container>
  );
}
