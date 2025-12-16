import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forumCategoryApi,
  forumPostApi,
  forumCommentApi,
  forumReportApi,
  forumNotificationApi,
} from "../api/forum.api";
import type {
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  UpdateCommentInput,
  CreateReportInput,
  ForumPost,
  ForumPostDetail,
  ForumCommentDetail,
} from "../types/forum.types";
import logger from "../../../shared/lib/logger";

interface PostsResponse {
  data: ForumPost[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}

interface CommentsResponse {
  data: ForumCommentDetail[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}

interface OldDataContext {
  posts?: PostsResponse;
  postDetail?: ForumPostDetail;
  commentsData?: CommentsResponse | unknown;
}

function parseBackendTimestamp(timestamp: string): Date {
  if (!timestamp) return new Date();

  const isoString = timestamp.includes("Z") ? timestamp : `${timestamp}Z`;
  return new Date(isoString);
}

const CACHE_TIMES = {
  CATEGORIES: 1000 * 60 * 10,
  POSTS: 1000 * 60 * 5,
  POST_DETAIL: 1000 * 60 * 3,
  COMMENTS: 1000 * 60 * 2,
  NOTIFICATIONS: 1000 * 60,
};

export const forumKeys = {
  all: ["forum"] as const,
  categories: () => [...forumKeys.all, "categories"] as const,
  categoryDetail: (id: number) => [...forumKeys.categories(), id] as const,
  posts: () => [...forumKeys.all, "posts"] as const,
  postsByCategory: (categoryId: number) =>
    [...forumKeys.posts(), categoryId] as const,
  postDetail: (id: number) => [...forumKeys.posts(), id] as const,
  comments: () => [...forumKeys.all, "comments"] as const,
  commentsByPost: (postId: number) =>
    [...forumKeys.comments(), postId] as const,
  commentDetail: (id: number) => [...forumKeys.comments(), id] as const,
  notifications: () => [...forumKeys.all, "notifications"] as const,
  unreadNotifications: () => [...forumKeys.notifications(), "unread"] as const,
};

export function useForumCategories() {
  return useQuery({
    queryKey: forumKeys.categories(),
    queryFn: async () => {
      const response = await forumCategoryApi.getAll();
      const categories = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      return categories;
    },
    staleTime: CACHE_TIMES.CATEGORIES,
  });
}

export function useForumPosts(
  categoryId?: number,
  page: number = 1,
  limit: number = 10,
  sortBy: "newest" | "trending" | "most-comments" = "newest",
  search: string = ""
) {
  return useQuery({
    queryKey: [
      categoryId ? forumKeys.postsByCategory(categoryId) : forumKeys.posts(),
      page,
      sortBy,
      search,
    ],
    queryFn: async () => {
      const response = await forumPostApi.getAll(
        categoryId,
        page,
        limit,
        sortBy,
        search
      );
      const posts = (response.data?.data || []).map(
        (
          post: ForumPost &
            Partial<Pick<ForumPostDetail, "author" | "category">>
        ) => ({
          ...post,
          createdAt: post.createdAt || post.created_at,
          updatedAt: post.updatedAt || post.updated_at,
          author: post.author || {
            id: (post.userId || post.user_id) as string,
            full_name: post.userName || post.full_name || "Unknown",
            avatar_url: post.userAvatar || post.avatar_url,
          },
          category: post.category || {
            id: post.categoryId || post.category_id || 0,
            name: post.category_name || "",
            slug: "",
          },
        })
      );
      return {
        data: posts,
        pagination: response.data?.pagination,
      };
    },
    staleTime: 0,
    gcTime: 1000,
  });
}

export function useForumPostDetail(postId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: forumKeys.postDetail(postId),
    queryFn: async () => {
      const response = await forumPostApi.getById(postId);
      const post = (response.data?.data || response.data) as
        | ForumPostDetail
        | undefined;
      if (!post) return null;
      return {
        ...post,
        createdAt: post.createdAt || post.created_at,
        updatedAt: post.updatedAt || post.updated_at,
        author: post.author || {
          id: (post.userId || post.user_id) as string,
          full_name: post.userName || post.full_name || "Unknown",
          avatar_url: post.userAvatar || post.avatar_url,
        },
        category: post.category || {
          id: post.categoryId || post.category_id || 0,
          name: post.category_name || "",
          slug: "",
        },
      };
    },
    staleTime: 0,
    gcTime: 1000,
    enabled: !!postId && enabled,
  });
}

export function useCreateForumPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostInput) => {
      logger.debug("[useCreateForumPost] Creating post with data:", data);
      const response = await forumPostApi.create(data);
      console.log("[useCreateForumPost] API Response:", response);
      console.log("[useCreateForumPost] response.data:", response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      logger.debug("[useCreateForumPost] Post created successfully", data);
      await queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    },
    onError: (error) => {
      logger.error("[useCreateForumPost] Error creating post:", error);
    },
  });
}

export function useUpdateForumPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { postId: number; data: UpdatePostInput }) => {
      logger.debug("[useUpdateForumPost] Updating post");
      const response = await forumPostApi.update(params.postId, params.data);
      return response.data;
    },
    onSuccess: async () => {
      logger.debug("[useUpdateForumPost] Post updated successfully");
      await queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    },
    onError: (error) => {
      logger.error("[useUpdateForumPost] Error updating post:", error);
    },
  });
}

export function useDeleteForumPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      logger.debug("[useDeleteForumPost] Deleting post");
      const response = await forumPostApi.delete(postId);
      return response.data;
    },
    onSuccess: async () => {
      logger.debug("[useDeleteForumPost] Post deleted successfully");
      await queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    },
    onError: (error) => {
      logger.error("[useDeleteForumPost] Error deleting post:", error);
    },
  });
}

export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      console.log("[useTogglePostLike] mutationFn START: postId=", postId);
      const response = await forumPostApi.toggleLike(postId);
      console.log("[useTogglePostLike] mutationFn RESPONSE:", response.data);
      return { postId, ...response.data };
    },
    onMutate: async (postId) => {
      console.log("[useTogglePostLike] onMutate START: postId=", postId);

      await queryClient.cancelQueries({
        queryKey: ["forum"],
      });

      const oldData: OldDataContext = {};

      const allQueries = queryClient.getQueriesData({ queryKey: ["forum"] });

      allQueries.forEach(([queryKey, queryData]) => {
        if (
          Array.isArray(queryKey) &&
          queryKey[0] === "forum" &&
          queryKey[1] === "posts" &&
          queryData
        ) {
          const postsResponse = queryData as PostsResponse;
          if (postsResponse.data) {
            console.log(
              "[useTogglePostLike] Found posts query, updating post",
              postId
            );
            oldData.posts = JSON.parse(JSON.stringify(postsResponse));

            queryClient.setQueryData(queryKey, {
              ...postsResponse,
              data: postsResponse.data.map((p: ForumPost) => {
                if (p.id === postId) {
                  return {
                    ...p,
                    is_liked: !p.is_liked,
                    likes_count: p.is_liked
                      ? Math.max(0, (p.likes_count ?? 0) - 1)
                      : (p.likes_count ?? 0) + 1,
                  };
                }
                return p;
              }),
            });
          }
        }
      });

      const postDetailKey = forumKeys.postDetail(postId);
      const oldPostDetail = queryClient.getQueryData(postDetailKey);
      console.log("[useTogglePostLike] Post detail exists:", !!oldPostDetail);
      if (oldPostDetail) {
        oldData.postDetail = JSON.parse(JSON.stringify(oldPostDetail));
        queryClient.setQueryData(
          postDetailKey,
          (old: ForumPostDetail | undefined) => {
            if (!old) return old;
            return {
              ...old,
              is_liked: !old.is_liked,
              likes_count: old.is_liked
                ? Math.max(0, (old.likes_count ?? 0) - 1)
                : (old.likes_count ?? 0) + 1,
            };
          }
        );
      }

      console.log("[useTogglePostLike] onMutate END, saved oldData");
      return oldData;
    },
    onError: (error, postId, context) => {
      console.error("[useTogglePostLike] onError:", error);
      console.log("[useTogglePostLike] Rollback with context:", context);

      if (context?.posts) {
        console.log("[useTogglePostLike] Rolling back posts data");
        queryClient.setQueriesData(
          { queryKey: forumKeys.posts() },
          context.posts
        );
      }
      if (context?.postDetail) {
        console.log("[useTogglePostLike] Rolling back post detail data");
        queryClient.setQueryData(
          forumKeys.postDetail(postId),
          context.postDetail
        );
      }
    },
    onSuccess: async (data) => {
      console.log("[useTogglePostLike] onSuccess START:", data);

      const { postId, data: responseData } = data;
      const is_liked = responseData?.is_liked ?? false;
      const likes_count = responseData?.likes_count ?? 0;
      console.log(
        "[useTogglePostLike] Server response: postId=",
        postId,
        "is_liked=",
        is_liked,
        "likes_count=",
        likes_count
      );

      queryClient.setQueryData(
        forumKeys.postDetail(postId),
        (old: ForumPostDetail | undefined) => {
          if (!old) {
            console.log(
              "[useTogglePostLike] onSuccess: Post detail not in cache, will refetch"
            );
            return old;
          }
          const newState = {
            ...old,
            is_liked: is_liked,
            likes_count: likes_count,
          };
          console.log(
            "[useTogglePostLike] onSuccess: Updated post detail",
            postId,
            "new likes_count:",
            likes_count,
            "is_liked:",
            is_liked
          );
          return newState;
        }
      );

      console.log("[useTogglePostLike] Refetching all forum queries");
      await queryClient.refetchQueries({
        queryKey: ["forum"],
      });

      console.log("[useTogglePostLike] onSuccess END");
    },
  });
}

export function useForumComments(
  postId: number,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: forumKeys.commentsByPost(postId),
    queryFn: async () => {
      logger.debug("[useForumComments] Fetching comments for postId:", postId);
      const response = await forumCommentApi.getByPostId(postId, page, limit);
      logger.debug("[useForumComments] Response received:", {
        success: response.data?.success,
        dataLength: response.data?.data?.length,
      });
      return response.data;
    },
    staleTime: 0,
    gcTime: 1000,
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentInput & { post_id: number }) => {
      logger.debug("[useCreateComment] Creating comment with data:", {
        postId: data.post_id,
        contentLength: data.content.length,
      });
      const response = await forumCommentApi.create(data.post_id, data);
      return response.data;
    },
    retry: 0,
    onSuccess: (responseData, variables) => {
      const postId = variables.post_id;
      logger.debug(
        "[useCreateComment] Comment created successfully, invalidating and refetching for postId:",
        postId
      );
      logger.debug("[useCreateComment] Response data:", responseData);

      queryClient.invalidateQueries({
        queryKey: ["forum"],
      });
      queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    },
    onError: (error) => {
      logger.error("[useCreateComment] Error creating comment:", error);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      commentId: number;
      data: UpdateCommentInput;
      postId?: number;
    }) => {
      logger.debug("[useUpdateComment] Updating comment");
      const response = await forumCommentApi.update(
        params.commentId,
        params.data
      );
      return response.data;
    },
    onSuccess: (_, params) => {
      logger.debug("[useUpdateComment] Comment updated successfully");
      if (params.postId) {
        queryClient.invalidateQueries({
          queryKey: forumKeys.commentsByPost(params.postId),
        });
      }
    },
    onError: (error) => {
      logger.error("[useUpdateComment] Error updating comment:", error);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      logger.debug("[useDeleteComment] Deleting comment");
      const response = await forumCommentApi.delete(commentId);
      return response.data;
    },
    onSuccess: () => {
      logger.debug("[useDeleteComment] Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: forumKeys.comments() });
    },
    onError: (error) => {
      logger.error("[useDeleteComment] Error deleting comment:", error);
    },
  });
}

export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      logger.debug("[useToggleCommentLike] Toggling like");
      const response = await forumCommentApi.toggleLike(commentId);
      return { commentId, ...response.data };
    },
    onMutate: async (commentId) => {
      logger.debug(
        "[useToggleCommentLike] Optimistic update for commentId:",
        commentId
      );

      await queryClient.cancelQueries({ queryKey: forumKeys.comments() });

      const commentsData = queryClient.getQueryData(forumKeys.comments());

      if (commentsData) {
        queryClient.setQueryData(
          forumKeys.comments(),
          (old: CommentsResponse | undefined) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.map((c: ForumCommentDetail) => {
                if (c.id === commentId) {
                  return {
                    ...c,
                    is_liked: !c.is_liked,
                    likes_count: c.is_liked
                      ? Math.max(0, (c.likes_count ?? 0) - 1)
                      : (c.likes_count ?? 0) + 1,
                  };
                }
                return c;
              }),
            };
          }
        );
      }

      return { commentsData };
    },
    onError: (error, commentId, context) => {
      logger.error("[useToggleCommentLike] Error toggling like:", error);

      if (context?.commentsData) {
        queryClient.setQueryData(forumKeys.comments(), context.commentsData);
      }
    },
    onSuccess: async (data) => {
      logger.debug("[useToggleCommentLike] Like toggled successfully", data);

      const { commentId, data: responseData } = data;
      const is_liked = responseData?.is_liked ?? false;
      const likes_count = responseData?.likes_count ?? 0;

      queryClient.setQueryData(
        forumKeys.comments(),
        (old: CommentsResponse | undefined) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((c: ForumCommentDetail) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  is_liked: is_liked,
                  likes_count: likes_count,
                };
              }
              return c;
            }),
          };
        }
      );

      await queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    },
  });
}

export function useCreateReport() {
  return useMutation({
    mutationFn: async (data: CreateReportInput) => {
      logger.debug("[useCreateReport] Creating report");
      const response = await forumReportApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      logger.debug("[useCreateReport] Report created successfully");
    },
    onError: (error) => {
      logger.error("[useCreateReport] Error creating report:", error);
    },
  });
}

export function useUserNotifications(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: forumKeys.notifications(),
    queryFn: async () => {
      const response = await forumNotificationApi.getAll(page, limit);
      return {
        notifications: response.data?.data || [],
        pagination: response.data?.pagination,
      };
    },
    staleTime: CACHE_TIMES.NOTIFICATIONS,
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: forumKeys.unreadNotifications(),
    queryFn: async () => {
      const response = await forumNotificationApi.getUnread();
      return response.data;
    },
    staleTime: CACHE_TIMES.NOTIFICATIONS,
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: [...forumKeys.unreadNotifications(), "count"],
    queryFn: async () => {
      const response = await forumNotificationApi.getUnreadCount();
      return response.data?.data?.unread_count || 0;
    },
    staleTime: CACHE_TIMES.NOTIFICATIONS,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: number) => {
      logger.debug("[useMarkNotificationAsRead] Marking notification as read");
      const response = await forumNotificationApi.markAsRead(notificationId);
      return response.data;
    },
    onSuccess: () => {
      logger.debug("[useMarkNotificationAsRead] Notification marked as read");
      queryClient.invalidateQueries({ queryKey: forumKeys.notifications() });
      queryClient.invalidateQueries({
        queryKey: forumKeys.unreadNotifications(),
      });
    },
    onError: (error) => {
      logger.error("[useMarkNotificationAsRead] Error:", error);
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      logger.debug("[useMarkAllNotificationsAsRead] Marking all as read");
      const response = await forumNotificationApi.markAllAsRead();
      return response.data;
    },
    onSuccess: () => {
      logger.debug("[useMarkAllNotificationsAsRead] All marked as read");
      queryClient.invalidateQueries({ queryKey: forumKeys.notifications() });
      queryClient.invalidateQueries({
        queryKey: forumKeys.unreadNotifications(),
      });
    },
    onError: (error) => {
      logger.error("[useMarkAllNotificationsAsRead] Error:", error);
    },
  });
}

export function useTogglePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await forumPostApi.togglePin(postId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    },
  });
}

export function useToggleLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await forumPostApi.toggleLock(postId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    },
  });
}

export function useReportComment() {
  return useMutation({
    mutationFn: async ({
      commentId,
      reason,
    }: {
      commentId: number;
      reason: string;
    }) => {
      const response = await forumCommentApi.report(commentId, reason);
      return response.data;
    },
  });
}

export { parseBackendTimestamp };
