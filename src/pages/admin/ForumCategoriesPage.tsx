import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ForumCategoriesPanel from "./ForumCategoriesPanel";

export default function ForumCategoriesPage() {
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
        <ForumCategoriesPanel />
      </Suspense>
    </Container>
  );
}
