import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { NewsList } from "../../features/news/components/NewsList";
import { EventsList } from "../../features/events/components/EventsList";
import { useNews } from "../../features/news/hooks/useNewsQuery";
import { useEvents } from "../../features/events/hooks/useEventsQuery";
import { NewsCategory, NewsStatus } from "../../shared/types/news.types";
import { EventStatus } from "../../shared/types/events.types";

export default function NewsAndEventsPage() {
  const [tab, setTab] = useState(0);
  const [newsPage, setNewsPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [newsSearch, setNewsSearch] = useState("");
  const [eventsSearch, setEventsSearch] = useState("");
  const [newsCategory, setNewsCategory] = useState<NewsCategory | "">("");
  const [eventStatus, setEventStatus] = useState<EventStatus | "">("");

  const { data: newsData, isLoading: newsLoading } = useNews({
    page: newsPage,
    limit: 9,
    search: newsSearch,
    category: newsCategory || undefined,
    status: NewsStatus.PUBLISHED,
  });

  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    page: eventsPage,
    limit: 9,
    search: eventsSearch,
    status: eventStatus || undefined,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Tin tức & Sự kiện
      </Typography>

      <Paper elevation={0} sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Tin tức" />
          <Tab label="Sự kiện" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Tìm kiếm tin tức..."
              value={newsSearch}
              onChange={(e) => {
                setNewsSearch(e.target.value);
                setNewsPage(1);
              }}
              size="small"
              sx={{ flexGrow: 1, minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={newsCategory}
                label="Danh mục"
                onChange={(e) => {
                  setNewsCategory(e.target.value as NewsCategory | "");
                  setNewsPage(1);
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={NewsCategory.ANNOUNCEMENT}>Thông báo</MenuItem>
                <MenuItem value={NewsCategory.GUIDE}>Hướng dẫn</MenuItem>
                <MenuItem value={NewsCategory.UPDATE}>Cập nhật</MenuItem>
                <MenuItem value={NewsCategory.OTHER}>Khác</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <NewsList news={newsData?.data || []} loading={newsLoading} />

          {newsData && newsData.pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={newsData.pagination.totalPages}
                page={newsPage}
                onChange={(_, page) => setNewsPage(page)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Tìm kiếm sự kiện..."
              value={eventsSearch}
              onChange={(e) => {
                setEventsSearch(e.target.value);
                setEventsPage(1);
              }}
              size="small"
              sx={{ flexGrow: 1, minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={eventStatus}
                label="Trạng thái"
                onChange={(e) => {
                  setEventStatus(e.target.value as EventStatus | "");
                  setEventsPage(1);
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={EventStatus.UPCOMING}>Sắp diễn ra</MenuItem>
                <MenuItem value={EventStatus.ONGOING}>Đang diễn ra</MenuItem>
                <MenuItem value={EventStatus.COMPLETED}>Đã kết thúc</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <EventsList events={eventsData?.data || []} loading={eventsLoading} />

          {eventsData && eventsData.pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={eventsData.pagination.totalPages}
                page={eventsPage}
                onChange={(_, page) => setEventsPage(page)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}
