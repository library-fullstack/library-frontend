import React, { Suspense } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import ModerationPendingPosts from "../../features/forum/components/ModerationPendingPosts";

export default function ForumPendingPostsPage() {
  return (
    <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
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
