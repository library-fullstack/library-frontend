import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  LocationOn,
  Person,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEventBySlug } from "../../features/events/hooks/useEventsQuery";
import { EventStatus } from "../../shared/types/events.types";

const statusLabels: Record<EventStatus, string> = {
  UPCOMING: "Sắp diễn ra",
  ONGOING: "Đang diễn ra",
  COMPLETED: "Đã kết thúc",
  CANCELLED: "Đã hủy",
};

const statusColors: Record<
  EventStatus,
  "success" | "primary" | "default" | "error"
> = {
  UPCOMING: "success",
  ONGOING: "primary",
  COMPLETED: "default",
  CANCELLED: "error",
};

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEventBySlug(slug || "");

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy sự kiện</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/events")}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/events")}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={statusLabels[event.status]}
            color={statusColors[event.status]}
            size="small"
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          {event.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mb: 3,
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 20 }} />
            <Typography variant="body1">
              {format(new Date(event.start_time), "EEEE, dd/MM/yyyy", {
                locale: vi,
              })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ fontSize: 20 }} />
            <Typography variant="body1">
              {format(new Date(event.start_time), "HH:mm", { locale: vi })} -{" "}
              {format(new Date(event.end_time), "HH:mm", { locale: vi })}
            </Typography>
          </Box>
          {event.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn sx={{ fontSize: 20 }} />
              <Typography variant="body1">{event.location}</Typography>
            </Box>
          )}
          {event.creator_name && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person sx={{ fontSize: 20 }} />
              <Typography variant="body1">
                Tổ chức bởi {event.creator_name}
              </Typography>
            </Box>
          )}
        </Box>

        {event.thumbnail_url && (
          <Box
            component="img"
            src={event.thumbnail_url}
            alt={event.title}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 1,
              mb: 3,
            }}
          />
        )}

        <Divider sx={{ my: 3 }} />

        {event.description && (
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
            }}
          >
            {event.description}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
