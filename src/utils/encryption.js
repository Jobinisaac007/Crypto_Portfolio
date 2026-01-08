// Simple encryption for demo purposes
// In production, use proper encryption libraries like crypto-js or Web Crypto API

const SECRET_KEY = "crypto-tracker-secret-key-2024";

/**
 * Encrypts a string value using Base64 encoding with obfuscation
 * @param {string} value - The value to encrypt
 * @returns {string} - Encrypted value
 */
export const encrypt = (value) => {
  try {
    if (!value) return "";
    
    // Add salt and encode
    const salt = Math.random().toString(36).substring(7);
    const combined = `${salt}:${value}:${SECRET_KEY}`;
    return btoa(combined);
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

/**
 * Decrypts an encrypted string
 * @param {string} encryptedValue - The encrypted value
 * @returns {string} - Decrypted value
 */
export const decrypt = (encryptedValue) => {
  try {
    if (!encryptedValue) return "";
    
    const decoded = atob(encryptedValue);
    const parts = decoded.split(":");
    
    // Verify secret key
    if (parts.length === 3 && parts[2] === SECRET_KEY) {
      return parts[1];
    }
    
    throw new Error("Invalid encrypted data");
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};

/**
 * Masks a string to show only last 4 characters
 * @param {string} value - Value to mask
 * @returns {string} - Masked value
 */
export const maskValue = (value) => {
  if (!value || value.length <= 4) return "••••";
  return "••••••••" + value.slice(-4);
};

/**
 * Generates a secure random string
 * @param {number} length - Length of random string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 16) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Hashes a value (one-way)
 * @param {string} value - Value to hash
 * @returns {string} - Hashed value
 */
export const hash = (value) => {
  try {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  } catch (error) {
    console.error("Hashing failed:", error);
    return "";
  }
};