import { encrypt, decrypt, isEncrypted } from "./encryption";

const SENSITIVE_KEYS = ["token", "refreshToken", "user", "accessToken"];

const shouldEncrypt = (key: string): boolean => {
  return SENSITIVE_KEYS.some((sensitiveKey) =>
    key.toLowerCase().includes(sensitiveKey.toLowerCase())
  );
};

export const secureSetItem = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    if (shouldEncrypt(key)) {
      const encrypted = await encrypt(value);
      localStorage.setItem(key, encrypted);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error("[SecureStorage] Failed to set item:", key, error);
    localStorage.setItem(key, value);
  }
};

export const secureGetItem = async (key: string): Promise<string | null> => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    if (shouldEncrypt(key) && isEncrypted(value)) {
      return await decrypt(value);
    }

    return value;
  } catch (error) {
    console.error("[SecureStorage] Failed to get item:", key, error);
    return localStorage.getItem(key);
  }
};

export const secureRemoveItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const secureClear = (): void => {
  localStorage.clear();
};

export const StorageUtil = {
  setItem: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },
  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
};

export const SecureStorage = {
  setItem: secureSetItem,
  getItem: secureGetItem,
  removeItem: secureRemoveItem,
  clear: secureClear,
};
