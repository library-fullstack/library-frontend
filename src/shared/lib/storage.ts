import logger from "./logger";
import { obfuscate, deobfuscate, shouldObfuscate } from "./obfuscation";

class StorageUtil {
  static getItem(key: string, storage: Storage = localStorage): string | null {
    try {
      const value = storage.getItem(key);
      if (!value) return null;

      if (shouldObfuscate(key)) {
        return deobfuscate(value);
      }

      return value;
    } catch (error) {
      logger.error(`[Storage] Error getting item "${key}":`, error);
      return null;
    }
  }

  static setItem(
    key: string,
    value: string,
    storage: Storage = localStorage
  ): boolean {
    try {
      const valueToStore = shouldObfuscate(key) ? obfuscate(value) : value;
      storage.setItem(key, valueToStore);
      return true;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "QuotaExceededError") {
          logger.error(`[Storage] Quota exceeded for key "${key}"`);
        } else if (error.name === "SecurityError") {
          logger.error(`[Storage] Security error - storage might be disabled`);
        }
      } else {
        logger.error(`[Storage] Error setting item "${key}":`, error);
      }
      return false;
    }
  }

  static removeItem(key: string, storage: Storage = localStorage): boolean {
    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      logger.error(`[Storage] Error removing item "${key}":`, error);
      return false;
    }
  }

  static clear(storage: Storage = localStorage): boolean {
    try {
      storage.clear();
      return true;
    } catch (error) {
      logger.error("[Storage] Error clearing storage:", error);
      return false;
    }
  }

  static getJSON<T>(key: string, storage: Storage = localStorage): T | null {
    try {
      const item = this.getItem(key, storage);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      logger.error(`[Storage] Error parsing JSON for key "${key}":`, error);
      return null;
    }
  }

  static setJSON<T>(
    key: string,
    value: T,
    storage: Storage = localStorage
  ): boolean {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized, storage);
    } catch (error) {
      logger.error(
        `[Storage] Error stringifying JSON for key "${key}":`,
        error
      );
      return false;
    }
  }

  static isAvailable(storage: Storage = localStorage): boolean {
    try {
      const testKey = "__storage_test__";
      storage.setItem(testKey, "test");
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

export default StorageUtil;
