import * as React from "react";
import { Box, Container, Stack } from "@mui/material";
import ForumHeader from "../../widgets/forum-header/ForumHeader";
import ForumCategoryTabs from "../../widgets/forum-category-tabs/ForumCategoryTabs";
import ForumPostCard from "../../widgets/forum-post-card/ForumPostCard";
import {
  mockPosts,
  forumCategories,
} from "../../features/forum/data/mockPosts";
import { ForumCategory } from "../../features/forum/types/forum.types";

export default function Forum(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] =
    React.useState<ForumCategory>("Tất cả");

  const handleCreatePost = React.useCallback(() => {
    // chưa làm phần tạo bài viết khi bấm vào tạo bài viết
  }, []);

  const handleSearch = React.useCallback((_query: string) => {
    // chưa làm xử lí logic khi tìm kiếm
  }, []);

  const handlePostClick = React.useCallback((_postId: number) => {
    // chưa làm phần xem bài viết khi bấm vào bài viết
  }, []);

  // filter các bài viết với danh mục
  const filteredPosts = React.useMemo(() => {
    if (selectedCategory === "Tất cả") return mockPosts;
    return mockPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="lg">
        {/* phần header với search và nút tạo bài */}
        <ForumHeader onCreatePost={handleCreatePost} onSearch={handleSearch} />

        {/* tab danh mục */}
        <ForumCategoryTabs
          categories={forumCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* danh sách các bài post */}
        {/* có lẽ nên thêm nút gì đó để bấm và bay lên đầu trang web ? */}
        {/* không có nhiều thời gian, cái này phức tạp quá. chắc là nên làm đơn giản thôi */}
        <Stack spacing={3}>
          {filteredPosts.map((post, index) => (
            <ForumPostCard
              key={post.id}
              post={post}
              index={index}
              onClick={handlePostClick}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
