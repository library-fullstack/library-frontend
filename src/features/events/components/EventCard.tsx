import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarToday, LocationOn, AccessTime } from "@mui/icons-material";
import type { Event, EventStatus } from "../../../shared/types/events.types";

interface EventCardProps {
  event: Event;
}

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

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.slug}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textDecoration: "none",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={handleClick}
    >
      {event.thumbnail_url && (
        <CardMedia
          component="img"
          height="180"
          image={event.thumbnail_url}
          alt={event.title}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Chip
            label={statusLabels[event.status]}
            size="small"
            color={statusColors[event.status]}
          />
        </Box>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "3.2em",
          }}
        >
          {event.title}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(event.start_time), "dd/MM/yyyy", { locale: vi })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(event.start_time), "HH:mm", { locale: vi })} -{" "}
              {format(new Date(event.end_time), "HH:mm", { locale: vi })}
            </Typography>
          </Box>

          {event.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {event.location}
              </Typography>
            </Box>
          )}
        </Box>

        {event.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.description}
          </Typography>
        )}

        {event.creator_name && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            Tổ chức bởi {event.creator_name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
