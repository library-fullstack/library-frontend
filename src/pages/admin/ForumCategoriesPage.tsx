import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ForumCategoriesPanel from "./ForumCategoriesPanel";

export default function ForumCategoriesPage() {
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
        <ForumCategoriesPanel />
      </Suspense>
    </Container>
  );
}
