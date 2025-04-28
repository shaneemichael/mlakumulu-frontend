// src/utils/errorUtils.ts

interface ApiError {
    status?: number;
    message?: string;
    errors?: Record<string, string[]>;
  }
  
  /**
   * Extract error message from API error response
   * @param error - Error object from API response
   * @returns Formatted error message
   */
  export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    const apiError = error as ApiError;
    
    if (apiError.message) {
      return apiError.message;
    }
    
    if (apiError.errors) {
      // Combine all error messages
      return Object.values(apiError.errors)
        .flat()
        .join(', ');
    }
    
    return 'An unknown error occurred. Please try again.';
  };
  
  /**
   * Handle API errors and return appropriate message
   * @param error - Error object from API response
   * @returns Formatted error message based on status code
   */
  export const handleApiError = (error: unknown): string => {
    const apiError = error as ApiError & { response?: ApiError };
    const status = apiError.status || apiError.response?.status;
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return getErrorMessage(error);
    }
  };