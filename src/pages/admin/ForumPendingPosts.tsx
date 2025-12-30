import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ModerationPendingPosts from "../../features/forum/components/ModerationPendingPosts";

export default function ForumPendingPostsPage() {
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
        <ModerationPendingPosts />
      </Suspense>
    </Container>
  );
}
