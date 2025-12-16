import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControlLabel,
  Switch,
  Alert,
  useTheme,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { forumApi } from "../../features/forum/api/forum.api";

interface ForumSettings {
  allow_students_create_post: boolean;
  allow_librarians_create_post: boolean;
  allow_moderators_create_post: boolean;
  allow_students_create_comment: boolean;
  allow_students_create_report: boolean;
  moderation_required: boolean;
}

export default function ForumSettingsPanel() {
  const theme = useTheme();
  const [settings, setSettings] = useState<ForumSettings>({
    allow_students_create_post: false,
    allow_librarians_create_post: true,
    allow_moderators_create_post: true,
    allow_students_create_comment: true,
    allow_students_create_report: true,
    moderation_required: true,
  });
  const [hasChanged, setHasChanged] = useState(false);

  const { data: fetchedSettings, isLoading } = useQuery({
    queryKey: ["forumSettings"],
    queryFn: async () => {
      const response = await forumApi.getForumSettings();
      return response.data?.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ForumSettings) =>
      Promise.resolve(forumApi.updateForumSettings(data)),
    onSuccess: () => {
      setHasChanged(false);
    },
  });

  useEffect(() => {
    if (
      fetchedSettings &&
      JSON.stringify(settings) !== JSON.stringify(fetchedSettings)
    ) {
      const timer = setTimeout(() => {
        setSettings(fetchedSettings);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedSettings]);

  const handleChange = (key: keyof ForumSettings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
    setHasChanged(true);
  };

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Cài đặt này kiểm soát ai có thể đăng bài, bình luận, báo cáo trong diễn
        đàn
      </Alert>

      <Card
        sx={{
          mb: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardHeader title="Quyền đăng bài" />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allow_students_create_post}
                  onChange={(e) =>
                    handleChange("allow_students_create_post", e.target.checked)
                  }
                />
              }
              label="Cho phép sinh viên đăng bài"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allow_librarians_create_post}
                  onChange={(e) =>
                    handleChange(
                      "allow_librarians_create_post",
                      e.target.checked
                    )
                  }
                />
              }
              label="Cho phép thư viện viên đăng bài"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allow_moderators_create_post}
                  onChange={(e) =>
                    handleChange(
                      "allow_moderators_create_post",
                      e.target.checked
                    )
                  }
                />
              }
              label="Cho phép moderator đăng bài"
            />
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardHeader title="Quyền tương tác" />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allow_students_create_comment}
                  onChange={(e) =>
                    handleChange(
                      "allow_students_create_comment",
                      e.target.checked
                    )
                  }
                />
              }
              label="Cho phép sinh viên bình luận"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allow_students_create_report}
                  onChange={(e) =>
                    handleChange(
                      "allow_students_create_report",
                      e.target.checked
                    )
                  }
                />
              }
              label="Cho phép sinh viên báo cáo vi phạm"
            />
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardHeader title="Duyệt bài" />
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={settings.moderation_required}
                onChange={(e) =>
                  handleChange("moderation_required", e.target.checked)
                }
              />
            }
            label="Bài viết cần được duyệt trước khi hiển thị"
          />
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanged || updateMutation.isPending}
        >
          {updateMutation.isPending ? <CircularProgress size={24} /> : "Lưu"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setSettings(fetchedSettings);
            setHasChanged(false);
          }}
          disabled={!hasChanged}
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
