import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Skeleton,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  MoreVertical as MoreIcon,
  Heart as HeartIcon,
  MessageCircle as CommentIcon,
  Pin as PinIcon,
  Lock as LockIcon,
} from "lucide-react";
import { useAuthContext } from "../../context/useAuthContext";
import {
  useForumPostDetail,
  useForumComments,
  useTogglePostLike,
  useDeleteForumPost,
  useCreateReport,
  useTogglePin,
  useToggleLock,
  parseBackendTimestamp,
} from "../../features/forum/hooks/useForum";
import {
  ForumPostDetail,
  ForumCommentDetail,
} from "../../features/forum/types/forum.types";
import ForumCommentComponent from "../../features/forum/components/ForumCommentComponent";
import CommentForm from "../../features/forum/components/CommentForm";

const PostDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuthContext();
  const id = postId ? parseInt(postId) : 0;

  const { data: postData, isLoading: postLoading } = useForumPostDetail(id);
  const { data: commentsData, isLoading: commentsLoading } =
    useForumComments(id);
  const { mutate: toggleLike, isPending: isTogglingLike } = useTogglePostLike();
  const { mutate: deletePost, isPending: isDeletingPost } =
    useDeleteForumPost();
  const { mutate: createReport } = useCreateReport();
  const { mutate: togglePin } = useTogglePin();
  const { mutate: toggleLock } = useToggleLock();

  const post: ForumPostDetail | null | undefined = postData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comments: ForumCommentDetail[] = (commentsData as any)?.data || [];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const isPostOwner = post && user && post.user_id === user.id;
  const isAdmin = user?.role === "ADMIN";
  const canEdit = isPostOwner;
  const canDelete = isPostOwner || isAdmin;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/forum/edit/${postId}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) {
      deletePost(id, {
        onSuccess: () => {
          navigate("/forum");
        },
      });
    }
    handleMenuClose();
  };

  const handleReportOpen = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim()) return;
    createReport(
      {
        target_type: "POST",
        target_post_id: id,
        reason: reportReason,
      },
      {
        onSuccess: () => {
          setReportDialogOpen(false);
          setReportReason("");
        },
      }
    );
  };

  const handleTogglePin = () => {
    togglePin(id, {
      onSuccess: () => {
        navigate("/forum");
      },
    });
    handleMenuClose();
  };

  const handleToggleLock = () => {
    toggleLock(id, {
      onSuccess: () => {
        window.location.reload();
      },
    });
    handleMenuClose();
  };

  if (postLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Skeleton height={40} width="80%" sx={{ mb: 2 }} />
          <Skeleton height={20} width="40%" sx={{ mb: 3 }} />
          <Skeleton height={200} sx={{ mb: 3 }} />
        </Paper>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error">Không tìm thấy bài viết</Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/forum")}
            sx={{ mt: 2 }}
          >
            Quay lại diễn đàn
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {post.pinned && (
              <PinIcon
                size={24}
                style={{ transform: "rotate(45deg)" }}
                color={theme.palette.primary.main}
              />
            )}
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {post.title}
            </Typography>
          </Box>
          {(canEdit || canDelete || isAdmin || !user) && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreIcon size={20} />
            </IconButton>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              sx: {
                maxWidth: "220px",
                minWidth: "180px",
              },
            },
          }}
        >
          {canEdit && <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>}
          {canDelete && (
            <MenuItem onClick={handleDelete} disabled={isDeletingPost}>
              Xóa
            </MenuItem>
          )}
          {isAdmin && (
            <MenuItem onClick={handleTogglePin}>
              <PinIcon size={16} style={{ marginRight: 8 }} />
              {post.pinned ? "Bỏ ghim" : "Ghim bài viết"}
            </MenuItem>
          )}
          {(isAdmin || user?.role === "MODERATOR") && (
            <MenuItem onClick={handleToggleLock}>
              <LockIcon size={16} style={{ marginRight: 8 }} />
              {post.is_locked ? "Mở khóa bình luận" : "Khóa bình luận"}
            </MenuItem>
          )}
          {user &&
            !isPostOwner &&
            user.role !== "ADMIN" &&
            user.role !== "MODERATOR" && (
              <MenuItem onClick={handleReportOpen}>Báo cáo</MenuItem>
            )}
        </Menu>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            src={post.userAvatar}
            alt={post.userName}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {post.userName || "Anonymous"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatDistanceToNow(
                parseBackendTimestamp(post.createdAt || post.created_at || ""),
                {
                  locale: vi,
                  addSuffix: true,
                }
              )}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              borderRadius: 1,
            }}
          >
            {post.category?.name}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            mb: 3,
            "& p": {
              mb: 1.5,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 1,
              my: 2,
            },
            "& h2, & h3": { mt: 2, mb: 1 },
            wordBreak: "break-word",
            overflowWrap: "break-word",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.attachments && post.attachments.length > 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: theme.palette.background.default,
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              📎 File đính kèm ({post.attachments.length})
            </Typography>
            <Stack spacing={2}>
              {post.attachments?.map(
                (attachment: {
                  id: number;
                  file_url: string;
                  file_name: string;
                  original_name: string;
                  file_type: string;
                  file_size: number;
                }) => {
                  const isImage = attachment.file_type?.startsWith("image/");
                  return (
                    <Box key={attachment.id}>
                      {isImage ? (
                        <Box
                          component="img"
                          src={attachment.file_url}
                          alt={attachment.original_name}
                          sx={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: 1,
                            cursor: "pointer",
                            "&:hover": { opacity: 0.9 },
                          }}
                          onClick={() =>
                            window.open(attachment.file_url, "_blank")
                          }
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 1.5,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="a"
                            href={attachment.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              flex: 1,
                              color: theme.palette.primary.main,
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {attachment.original_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {(attachment.file_size / 1024).toFixed(2)} KB
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                }
              )}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CommentIcon size={18} />
              <Typography variant="body2">{post.comments_count}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: !user ? "not-allowed" : "pointer",
              color: post?.is_liked ? "#dc2626" : theme.palette.text.secondary,
              transition: "all 0.2s ease",
              opacity: !user || isTogglingLike ? 0.6 : 1,
              "&:hover": {
                opacity: !user || isTogglingLike ? 0.6 : 0.8,
                color: post?.is_liked ? "#991b1b" : theme.palette.text.primary,
              },
              pointerEvents: !user || isTogglingLike ? "none" : "auto",
            }}
            onClick={() => {
              if (!user) {
                navigate("/auth/login");
                return;
              }
              toggleLike(id);
            }}
          >
            <HeartIcon
              size={18}
              fill={post?.is_liked ? "currentColor" : "none"}
              stroke={post?.is_liked ? "#dc2626" : "currentColor"}
            />
            <span>{post?.likes_count}</span>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Bình luận ({comments.length})
        </Typography>

        {post.is_locked ? (
          <Box
            sx={{
              p: 2,
              mb: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 152, 0, 0.1)"
                  : "rgba(255, 152, 0, 0.05)",
              border: `1px solid ${theme.palette.warning.main}`,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LockIcon size={20} color={theme.palette.warning.main} />
            <Typography variant="body2" color="warning.main">
              Bài viết này đã bị khóa bình luận
            </Typography>
          </Box>
        ) : (
          <CommentForm postId={id} />
        )}

        {commentsLoading ? (
          <Stack spacing={2} sx={{ mt: 3 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={100} variant="rectangular" />
            ))}
          </Stack>
        ) : comments && comments.length > 0 ? (
          <Stack spacing={2} sx={{ mt: 3 }}>
            {comments.map((comment: ForumCommentDetail) => (
              <ForumCommentComponent
                key={comment.id}
                comment={comment}
                postId={id}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Chưa có bình luận nào
          </Typography>
        )}
      </Paper>

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      >
        <DialogTitle>Báo cáo bài viết</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do báo cáo"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleReportSubmit}
            variant="contained"
            disabled={!reportReason.trim()}
          >
            Báo cáo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetailPage;
