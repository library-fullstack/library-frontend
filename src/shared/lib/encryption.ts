const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

const getEncryptionKey = async (): Promise<CryptoKey> => {
  const secret =
    import.meta.env.VITE_STORAGE_SECRET ||
    "default-dev-secret-change-in-production";

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);

  return await crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encrypt = async (plaintext: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("[Encryption] Failed to encrypt:", error);
    return plaintext;
  }
};

export const decrypt = async (ciphertext: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();

    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("[Encryption] Failed to decrypt:", error);
    return ciphertext;
  }
};

export const isEncrypted = (value: string): boolean => {
  if (!value) return false;

  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(value)) return false;

  try {
    const decoded = atob(value);
    return decoded.length > IV_LENGTH;
  } catch {
    return false;
  }
};
