import { useState } from "react";
import { Box, TextField, Button, Stack, CircularProgress } from "@mui/material";
import { useCreateComment } from "../hooks/useForum";

interface Props {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
  placeholder?: string;
}

const CommentForm = ({
  postId,
  parentId,
  onSuccess,
  placeholder = "Viết bình luận...",
}: Props) => {
  const [content, setContent] = useState("");
  const { mutate: createComment, isPending } = useCreateComment();

  const handleSubmit = () => {
    if (!content.trim()) return;

    createComment(
      {
        post_id: postId,
        content: content.trim(),
        parent_id: parentId,
      },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        disabled={isPending}
      />
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim() || isPending}
          sx={{ minWidth: 80 }}
        >
          {isPending ? <CircularProgress size={24} /> : "Bình luận"}
        </Button>
      </Box>
    </Stack>
  );
};

export default CommentForm;
