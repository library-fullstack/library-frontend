import { get, set, del, clear } from "idb-keyval";
import logger from "./logger";

class DatabaseService {
  private prefix = "lib-";

  async saveBook(id: number, bookData: unknown): Promise<void> {
    try {
      await set(this.prefix + `book-${id}`, bookData);
      logger.debug("[DB] Book saved:", id);
    } catch (err) {
      logger.error("[DB] Failed to save book:", err);
    }
  }

  async getBook(id: number): Promise<unknown> {
    try {
      const data = await get(this.prefix + `book-${id}`);
      logger.debug("[DB] Book retrieved:", id);
      return data;
    } catch (err) {
      logger.error("[DB] Failed to get book:", err);
      return null;
    }
  }

  async queueMutation(mutation: {
    action: "ADD_TO_CART" | "REMOVE_FROM_CART" | "BORROW";
    data: unknown;
    timestamp?: number;
  }): Promise<string> {
    try {
      const id = `${mutation.action}-${Date.now()}`;
      const queueItem = {
        id,
        ...mutation,
        timestamp: mutation.timestamp || Date.now(),
        retries: 0,
      };
      await set(this.prefix + `pending-${id}`, queueItem);
      logger.debug("[DB] Mutation queued:", id);
      return id;
    } catch (err) {
      logger.error("[DB] Failed to queue mutation:", err);
      throw err;
    }
  }

  async getPendingMutations(): Promise<unknown[]> {
    try {
      const mutationsJson = (await get(this.prefix + "pending-mutations")) as
        | string
        | null;
      const mutations = mutationsJson ? JSON.parse(mutationsJson) : [];
      logger.debug("[DB] Pending mutations retrieved:", mutations.length);
      return mutations;
    } catch (err) {
      logger.error("[DB] Failed to get pending mutations:", err);
      return [];
    }
  }

  async addPendingMutation(mutation: unknown): Promise<void> {
    try {
      const mutations = await this.getPendingMutations();
      mutations.push(mutation);
      await set(this.prefix + "pending-mutations", JSON.stringify(mutations));
      logger.debug("[DB] Added to pending mutations");
    } catch (err) {
      logger.error("[DB] Failed to add pending mutation:", err);
    }
  }

  async removePendingMutation(id: string): Promise<void> {
    try {
      const allMutations = await this.getPendingMutations();
      const mutations = allMutations.filter((m: unknown) => {
        return (m as Record<string, unknown>).id !== id;
      });
      await set(this.prefix + "pending-mutations", JSON.stringify(mutations));
      logger.debug("[DB] Mutation removed:", id);
    } catch (err) {
      logger.error("[DB] Failed to remove mutation:", err);
    }
  }

  async saveForumPosts(posts: unknown): Promise<void> {
    try {
      await set(this.prefix + "forum-posts", posts);
      logger.debug("[DB] Forum posts saved");
    } catch (err) {
      logger.error("[DB] Failed to save forum posts:", err);
    }
  }

  async getForumPosts(): Promise<unknown> {
    try {
      const posts = await get(this.prefix + "forum-posts");
      logger.debug("[DB] Forum posts retrieved");
      return posts;
    } catch (err) {
      logger.error("[DB] Failed to get forum posts:", err);
      return null;
    }
  }

  async clearCategory(
    category: "books" | "posts" | "mutations" | "all"
  ): Promise<void> {
    try {
      if (category === "all") {
        await clear();
        logger.debug("[DB] All storage cleared");
        return;
      }

      const keyToDelete =
        this.prefix +
        (category === "books"
          ? "book-"
          : category === "posts"
          ? "forum-posts"
          : "pending-mutations");

      await del(keyToDelete);
      logger.debug("[DB] Category cleared:", category);
    } catch (err) {
      logger.error("[DB] Failed to clear category:", err);
    }
  }

  async getStorageInfo(): Promise<{ used: number; estimated: number }> {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          estimated: estimate.quota || 0,
        };
      }
    } catch (err) {
      logger.error("[DB] Failed to get storage info:", err);
    }
    return { used: 0, estimated: 0 };
  }

  async requestPersistentStorage(): Promise<boolean> {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const persistent = await navigator.storage.persist();
        logger.debug("[DB] Persistent storage:", persistent);
        return persistent;
      }
    } catch (err) {
      logger.error("[DB] Failed to request persistent storage:", err);
    }
    return false;
  }
}

export const dbService = new DatabaseService();
