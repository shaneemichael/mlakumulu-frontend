// src/utils/storageUtils.ts

/**
 * Save data to local storage
 * @param key - Storage key
 * @param value - Value to store
 */
export const saveToStorage = <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  /**
   * Get data from local storage
   * @param key - Storage key
   * @param defaultValue - Default value if key not found
   * @returns Stored value or default value
   */
  export const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  };
  
  /**
   * Remove data from local storage
   * @param key - Storage key
   */
  export const removeFromStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  };
  
  /**
   * Clear all data from local storage
   */
  export const clearStorage = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };
  
  /**
   * Storage keys used in the application
   */
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    LANGUAGE: 'language',
    THEME: 'theme',
  };