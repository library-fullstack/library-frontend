const getObfuscationKey = (): string => {
  return import.meta.env.VITE_STORAGE_KEY || "LibSysKey2025";
};

export const obfuscate = (plaintext: string): string => {
  if (!plaintext) return plaintext;

  try {
    const key = getObfuscationKey();
    const obfuscated: number[] = [];

    for (let i = 0; i < plaintext.length; i++) {
      const charCode = plaintext.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      obfuscated.push(charCode ^ keyChar);
    }

    const binaryString = String.fromCharCode(...obfuscated);
    return btoa(binaryString);
  } catch (error) {
    console.error("[Obfuscation] Failed to obfuscate:", error);
    return plaintext;
  }
};

export const deobfuscate = (obfuscated: string): string => {
  if (!obfuscated) return obfuscated;

  try {
    if (!/^[A-Za-z0-9+/=]+$/.test(obfuscated)) {
      return obfuscated;
    }

    const key = getObfuscationKey();
    const binaryString = atob(obfuscated);
    const deobfuscated: string[] = [];

    for (let i = 0; i < binaryString.length; i++) {
      const charCode = binaryString.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      deobfuscated.push(String.fromCharCode(charCode ^ keyChar));
    }

    return deobfuscated.join("");
  } catch (error) {
    console.error("[Obfuscation] Failed to deobfuscate:", error);
    return obfuscated;
  }
};

export const shouldObfuscate = (key: string): boolean => {
  const sensitivePatterns = [
    "token",
    "Token",
    "TOKEN",
    "password",
    "Password",
    "user",
    "auth",
  ];

  return sensitivePatterns.some((pattern) => key.includes(pattern));
};
