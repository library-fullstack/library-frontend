import { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  LinearProgress,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  Star as StarIcon,
  MessageSquare as MessageSquareIcon,
  Heart as HeartIcon,
  Award as AwardIcon,
} from "lucide-react";

interface UserProfileProps {
  userId?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-profile-tabpanel-${index}`}
      aria-labelledby={`user-profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const user = {
    id: userId || 1,
    fullName: "Nguyễn Văn A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    email: "user@example.com",
    role: "STUDENT",
    joinDate: new Date("2024-01-15"),
    reputation: 850,
    reputationLevel: "Expert",
    stats: {
      posts: 24,
      comments: 156,
      likes: 342,
      badges: 8,
    },
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation < 100) return { level: "Beginner", color: "info" as const };
    if (reputation < 500) return { level: "Member", color: "success" as const };
    if (reputation < 1000)
      return { level: "Expert", color: "warning" as const };
    return { level: "Master", color: "error" as const };
  };

  const getReputationProgress = (reputation: number) => {
    const maxRep = 1000;
    return Math.min((reputation / maxRep) * 100, 100);
  };

  const { level, color } = getReputationLevel(user.reputation);
  const progress = getReputationProgress(user.reputation);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* User Header */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Avatar src={user.avatar} sx={{ width: 120, height: 120 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: "grow" }}>
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {user.fullName}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  color={
                    user.role === "ADMIN"
                      ? "error"
                      : user.role === "MODERATOR"
                      ? "warning"
                      : "default"
                  }
                />
              </Stack>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {user.email}
              </Typography>

              <Typography variant="caption" color="textSecondary">
                Tham gia từ{" "}
                {user.joinDate.toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              sx={{ mb: 2 }}
            >
              <StarIcon
                size={40}
                style={{ color: theme.palette.warning.main }}
              />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {user.reputation}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Điểm danh tiếng
                </Typography>
              </Box>
              <Chip label={level} color={color} />
            </Stack>

            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="caption">Tiến độ lên cấp</Typography>
                <Typography variant="caption">
                  {user.reputation} / 1000
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user.stats.posts}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Bài viết
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user.stats.comments}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Bình luận
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user.stats.likes}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Like
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user.stats.badges}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Huy hiệu
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <MessageSquareIcon size={32} />
                  <Box>
                    <Typography variant="h6">{user.stats.comments}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Bình luận
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <HeartIcon size={32} />
                  <Box>
                    <Typography variant="h6">{user.stats.likes}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Like nhận được
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AwardIcon size={32} />
                  <Box>
                    <Typography variant="h6">{user.stats.badges}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Huy hiệu
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="User profile tabs"
        >
          <Tab
            label={`Bài viết (${user.stats.posts})`}
            id="user-profile-tab-0"
          />
          <Tab
            label={`Hoạt động (${user.stats.comments})`}
            id="user-profile-tab-1"
          />
          <Tab label="Huy hiệu" id="user-profile-tab-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography color="textSecondary" align="center">
            Chưa có bài viết nào
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography color="textSecondary" align="center">
            Chưa có hoạt động nào
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label="🏆 Người sáng lập" variant="outlined" sx={{ m: 1 }} />
            <Chip
              label="⭐ Bình luận xuất sắc"
              variant="outlined"
              sx={{ m: 1 }}
            />
            <Chip
              label="🎯 Đóng góp tích cực"
              variant="outlined"
              sx={{ m: 1 }}
            />
          </Stack>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserProfile;
