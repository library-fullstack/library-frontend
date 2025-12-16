import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Lock as LockIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";
import {
  useForumCategories,
  useCreateForumPost,
  useUpdateForumPost,
  useForumPostDetail,
} from "../../features/forum/hooks/useForum";
import {
  CreatePostInput,
  ForumCategory,
} from "../../features/forum/types/forum.types";
import FileUpload from "../../features/forum/components/FileUpload";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuthContext();
  const isEditMode = !!postId;

  const { data: categoriesData, isLoading: categoriesLoading } =
    useForumCategories();
  const { data: postData, isLoading: postLoading } = useForumPostDetail(
    postId ? parseInt(postId) : 0,
    isEditMode
  );
  const { mutate: createPost, isPending: isCreating } = useCreateForumPost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdateForumPost();

  const postDetail = postData
    ? (
        postData as unknown as {
          data: {
            title?: string;
            content?: string;
            category_id?: number;
            categoryId?: number;
          };
        }
      ).data
    : undefined;
  const [formData, setFormData] = useState<CreatePostInput>({
    title: postDetail?.title || "",
    content: postDetail?.content || "",
    categoryId: postDetail?.categoryId || postDetail?.category_id || 0,
    files: [],
  });
  const [error, setError] = useState("");

  const categories = (categoriesData as ForumCategory[]) || [];
  const isLoading = isCreating || isUpdating;

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const hasPermission = selectedCategory
    ? selectedCategory.allowed_roles?.split(",").includes(user?.role || "")
    : false;

  const isCategoryLocked = selectedCategory?.is_locked || false;

  const handleChange = (
    field: keyof CreatePostInput,
    value: string | number
  ) => {
    let finalValue: string | number = value;
    if (field === "categoryId") {
      finalValue = value ? parseInt(value as string, 10) : 0;
    }
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết");
      return false;
    }
    if (formData.title.length < 5 || formData.title.length > 200) {
      setError("Tiêu đề phải từ 5 đến 200 ký tự");
      return false;
    }
    if (!formData.content.trim()) {
      setError("Vui lòng nhập nội dung bài viết");
      return false;
    }
    if (formData.content.length < 20) {
      setError("Nội dung phải ít nhất 20 ký tự");
      return false;
    }
    if (!formData.categoryId) {
      setError("Vui lòng chọn chủ đề");
      return false;
    }
    if (isCategoryLocked) {
      setError("Chủ đề này đã bị khóa, không thể đăng bài");
      return false;
    }
    if (!hasPermission) {
      setError("Bạn không có quyền đăng bài trong chủ đề này");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditMode && postId) {
      const category = categories.find((c) => c.id === formData.categoryId);
      const categorySlug = category?.slug || "general";
      updatePost(
        { postId: parseInt(postId), data: formData },
        {
          onSuccess: () => {
            navigate(`/forum/${categorySlug}/${postId}`);
          },
          onError: (err: Error | { message?: string }) => {
            setError(
              err instanceof Error
                ? err.message
                : err.message || "Lỗi cập nhật bài viết"
            );
          },
        }
      );
    } else {
      createPost(formData, {
        onSuccess: (response) => {
          const postId = response.data?.id;

          const category = categories.find((c) => c.id === formData.categoryId);
          const categorySlug = category?.slug || "general";
          console.log(
            "[CreatePostPage] Post created - categoryId:",
            formData.categoryId,
            "categorySlug:",
            categorySlug,
            "categories available:",
            categories.length,
            "postId:",
            postId,
            "full response:",
            response
          );
          navigate(`/forum/${categorySlug}/${postId}`);
        },
        onError: (err: Error | { message?: string }) => {
          setError(
            err instanceof Error
              ? err.message
              : err.message || "Lỗi tạo bài viết"
          );
        },
      });
    }
  };

  if (isEditMode && postLoading) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 1 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            label="Tiêu đề"
            placeholder="Nhập tiêu đề bài viết của bạn..."
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            maxRows={2}
            helperText={`${formData.title.length}/200`}
          />

          <FormControl fullWidth>
            <InputLabel>Chủ đề</InputLabel>
            <Select
              value={formData.categoryId?.toString() || ""}
              label="Chủ đề"
              onChange={(e) =>
                handleChange("categoryId", e.target.value as string)
              }
              disabled={categoriesLoading}
            >
              <MenuItem value="">-- Chọn chủ đề --</MenuItem>
              {categories.map((cat: ForumCategory) => {
                const canPost = cat.allowed_roles
                  ?.split(",")
                  .includes(user?.role || "");
                const isLocked = Boolean(cat.is_locked);
                return (
                  <MenuItem
                    key={`cat-${cat.id}`}
                    value={cat.id}
                    disabled={isLocked || !canPost}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                      }}
                    >
                      {cat.name}
                      {isLocked && (
                        <LockIcon size={16} style={{ marginLeft: "auto" }} />
                      )}
                      {!canPost && !isLocked && (
                        <LockIcon
                          size={16}
                          style={{ marginLeft: "auto", opacity: 0.5 }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            label="Nội dung"
            placeholder="Nhập nội dung bài viết của bạn..."
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            fullWidth
            multiline
            minRows={8}
            maxRows={20}
            helperText={`${formData.content.length} ký tự (tối thiểu 20)`}
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Tệp đính kèm (tuỳ chọn)
            </Typography>
            <FileUpload
              onFilesUpload={(files) =>
                setFormData((prev) => ({ ...prev, files }))
              }
              maxFiles={5}
              maxFileSize={10}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/forum")}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (formData.categoryId !== 0 &&
                  (!hasPermission || isCategoryLocked))
              }
              sx={{ minWidth: 120 }}
              title={
                isCategoryLocked
                  ? "Chủ đề này đã bị khóa"
                  : !hasPermission && formData.categoryId !== 0
                  ? "Bạn không có quyền đăng bài trong chủ đề này"
                  : ""
              }
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                "Cập nhật"
              ) : (
                "Đăng bài"
              )}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreatePostPage;
