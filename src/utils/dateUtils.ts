// src/utils/dateUtils.ts

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param includeTime - Whether to include time in the formatted string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, includeTime = false): string => {
    const date = new Date(dateString);
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  /**
   * Calculate the number of days between two dates
   * @param startDate - Start date string
   * @param endDate - End date string
   * @returns Number of days
   */
  export const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  /**
   * Convert a date to the format required by datetime-local input
   * @param dateString - ISO date string
   * @returns Formatted date string for input
   */
  export const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };
  
  /**
   * Check if a date is in the past
   * @param dateString - ISO date string
   * @returns Boolean indicating if date is in the past
   */
  export const isDateInPast = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  };