import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CommentForm from "./CommentForm";
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Heart as HeartIcon,
  MessageCircle as ReplyIcon,
  MoreVertical as MoreIcon,
} from "lucide-react";
import {
  parseBackendTimestamp,
  useToggleCommentLike,
  useDeleteComment,
  useUpdateComment,
  useReportComment,
} from "../hooks/useForum";
import { ForumCommentDetail } from "../types/forum.types";
import { useAuthContext } from "../../../context/useAuthContext";

interface Props {
  comment: ForumCommentDetail;
  postId: number;
  isReply?: boolean;
  onReplyClick?: () => void;
}

const ForumCommentComponent = ({
  comment,
  postId,
  isReply = false,
  onReplyClick,
}: Props) => {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { mutate: toggleLike, isPending: isTogglingLike } =
    useToggleCommentLike();
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatingComment } =
    useUpdateComment();
  const { mutate: reportComment } = useReportComment();

  const isCommentOwner = user && comment.user_id === user.id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updateComment(
        { commentId: comment.id, data: { content: editContent } },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) {
      deleteComment(comment.id);
    }
    handleMenuClose();
  };

  const handleReportOpen = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim() || reportReason.trim().length < 10) {
      alert("Lý do báo cáo phải có ít nhất 10 ký tự");
      return;
    }
    reportComment(
      {
        commentId: comment.id,
        reason: reportReason.trim(),
      },
      {
        onSuccess: () => {
          setReportDialogOpen(false);
          setReportReason("");
          alert("Báo cáo đã được gửi thành công");
        },
      }
    );
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <Avatar
        src={comment.author?.avatar_url}
        alt={comment.author?.full_name}
        sx={{ width: 36, height: 36, flexShrink: 0 }}
      />
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {comment.author?.full_name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {comment.created_at
                ? formatDistanceToNow(
                    parseBackendTimestamp(comment.created_at),
                    {
                      locale: vi,
                      addSuffix: true,
                    }
                  )
                : "vừa xong"}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreIcon size={16} />
          </IconButton>
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
                maxWidth: "200px",
                minWidth: "150px",
              },
            },
          }}
        >
          {isCommentOwner && (
            <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>
          )}
          {isCommentOwner && (
            <MenuItem onClick={handleDelete} disabled={isDeletingComment}>
              Xóa
            </MenuItem>
          )}
          {user && !isCommentOwner && user.role !== "ADMIN" && (
            <MenuItem onClick={handleReportOpen}>Báo cáo</MenuItem>
          )}
        </Menu>

        {isEditing ? (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              size="small"
              variant="outlined"
            />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveEdit}
                disabled={isUpdatingComment}
              >
                Lưu
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                disabled={isUpdatingComment}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {comment.content}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: isTogglingLike ? "not-allowed" : "pointer",
                  color: comment.is_liked ? "#dc2626" : "inherit",
                  transition: "all 0.2s ease",
                  opacity: isTogglingLike ? 0.6 : 1,
                  "&:hover": {
                    opacity: isTogglingLike ? 0.6 : 0.8,
                    color: comment.is_liked ? "#991b1b" : "inherit",
                  },
                  pointerEvents: isTogglingLike ? "none" : "auto",
                }}
                onClick={() => {
                  toggleLike(comment.id);
                }}
              >
                <HeartIcon
                  size={16}
                  fill={comment.is_liked ? "currentColor" : "none"}
                  stroke={comment.is_liked ? "#dc2626" : "currentColor"}
                />
                <span>{comment.likes_count || 0}</span>
              </Box>
              {!isReply && (
                <Button
                  size="small"
                  startIcon={<ReplyIcon size={16} />}
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  Trả lời
                </Button>
              )}
            </Box>
          </>
        )}

        {showReplyForm && !isReply && (
          <Box sx={{ mt: 2, ml: 4 }}>
            <CommentForm
              postId={postId}
              parentId={comment.id}
              placeholder="Trả lời bình luận..."
              onSuccess={() => setShowReplyForm(false)}
            />
          </Box>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <Box
            sx={{
              ml: 2,
              mt: 2,
              pl: 2,
              borderLeft: `2px solid ${theme.palette.divider}`,
            }}
          >
            {comment.replies.map((reply: ForumCommentDetail) => (
              <ForumCommentComponent
                key={reply.id}
                comment={reply}
                postId={postId}
                isReply={true}
              />
            ))}
          </Box>
        )}
      </Box>

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      >
        <DialogTitle>Báo cáo bình luận</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do báo cáo"
            fullWidth
            multiline
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            helperText="Vui lòng nhập ít nhất 10 ký tự"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleReportSubmit}
            variant="contained"
            disabled={reportReason.trim().length < 10}
          >
            Gửi báo cáo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumCommentComponent;
