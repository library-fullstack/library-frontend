import React from "react";
import { Grid, Box, CircularProgress, Typography, Alert } from "@mui/material";
import { EventCard } from "./EventCard";
import type { Event } from "../../../shared/types/events.types";

interface EventsListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          Chưa có sự kiện nào
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
};
