import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { forumModerationApi } from "../api/forum.api";
import RejectPostDialog from "../../admin/components/RejectPostDialog";
import type {
  ForumPost,
  ApiResponse,
  PaginationMeta,
} from "../types/forum.types";

interface PendingPostsProps {
  onPostUpdated?: () => void;
}

const PendingPostsList: React.FC<PendingPostsProps> = ({ onPostUpdated }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [rejectingPost, setRejectingPost] = useState<number | null>(null);
  const [_rejectReason, setRejectReason] = useState("");

  const limit = 20;

  useEffect(() => {
    fetchPendingPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const axiosResponse = await forumModerationApi.getPendingPosts(
        page,
        limit
      );
      const response = axiosResponse.data as ApiResponse<ForumPost[]> & {
        pagination: PaginationMeta;
      };
      setPosts(response.data || []);
      setTotal(response.pagination?.total || 0);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách bài cần duyệt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: number) => {
    try {
      await forumModerationApi.approvePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      onPostUpdated?.();
    } catch (err) {
      console.error("Error approving post:", err);
      alert("Lỗi khi duyệt bài viết");
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectingPost) return;

    try {
      await forumModerationApi.rejectPost(rejectingPost, reason);
      setPosts(posts.filter((p) => p.id !== rejectingPost));
      setRejectingPost(null);
      setRejectReason("");
      onPostUpdated?.();
    } catch (err) {
      console.error("Error rejecting post:", err);
      alert("Lỗi khi từ chối bài viết");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {posts.length === 0 ? (
        <Alert severity="info">Không có bài viết chờ duyệt</Alert>
      ) : (
        <>
          {posts.map((post) => (
            <Card key={post.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.content}
                </Typography>

                <Stack direction="row" spacing={1} mb={2} alignItems="center">
                  <Chip
                    label={post.full_name || "Người dùng"}
                    size="small"
                    variant="outlined"
                  />
                  {(post.userRole || "") === "MODERATOR" && (
                    <Chip
                      label="Moderator"
                      size="small"
                      color="primary"
                      variant="filled"
                    />
                  )}
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleApprove(post.id)}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setRejectingPost(post.id)}
                  >
                    Từ chối
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}

          <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              Trang trước
            </Button>
            <Typography>
              Trang {page} / {Math.ceil(total / limit)}
            </Typography>
            <Button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
            >
              Trang sau
            </Button>
          </Stack>
        </>
      )}

      <RejectPostDialog
        open={rejectingPost !== null}
        postTitle={posts.find((p) => p.id === rejectingPost)?.title || ""}
        onClose={() => {
          setRejectingPost(null);
          setRejectReason("");
        }}
        onConfirm={handleReject}
      />
    </Box>
  );
};

export default PendingPostsList;
