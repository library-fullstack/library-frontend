import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../../shared/api/axiosClient";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Post {
  id: number;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  rejection_reason?: string;
}

export default function MyPostsTab() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["my-forum-posts"],
    queryFn: async () => {
      const res = await axiosClient.get<{
        success: boolean;
        data: Post[];
      }>("/forum/my-posts");
      return res.data.data;
    },
  });

  const pendingPosts = data?.filter((p) => p.status === "PENDING") || [];
  const approvedPosts = data?.filter((p) => p.status === "APPROVED") || [];
  const rejectedPosts = data?.filter((p) => p.status === "REJECTED") || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  const renderPosts = (posts: Post[]) => {
    if (posts.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Không có bài viết
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {posts.map((post) => (
          <ListItem
            key={post.id}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 1 }}>
                {post.status !== "REJECTED" && (
                  <IconButton
                    edge="end"
                    onClick={() => navigate(`/forum/posts/${post.id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                )}
              </Box>
            }
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "&:last-child": { borderBottom: 0 },
            }}
          >
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {post.title}
                  </Typography>
                  <Chip
                    label={getStatusLabel(post.status)}
                    size="small"
                    color={
                      getStatusColor(post.status) as
                        | "default"
                        | "primary"
                        | "secondary"
                        | "error"
                        | "info"
                        | "success"
                        | "warning"
                    }
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(post.created_at), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </Typography>
                  {post.rejection_reason && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Lý do từ chối:
                      </Typography>
                      <Typography variant="body2">
                        {post.rejection_reason}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Paper sx={{ mt: 3 }}>
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={`Chờ duyệt (${pendingPosts.length})`} />
        <Tab label={`Đã duyệt (${approvedPosts.length})`} />
        <Tab label={`Bị từ chối (${rejectedPosts.length})`} />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tab === 0 && renderPosts(pendingPosts)}
            {tab === 1 && renderPosts(approvedPosts)}
            {tab === 2 && renderPosts(rejectedPosts)}
          </>
        )}
      </Box>
    </Paper>
  );
}
