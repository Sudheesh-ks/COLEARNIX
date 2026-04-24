/**
 * API Error Handling Utility
 * Standardizes how errors from Axios/API are extracted
 */

export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data?.message || error.response.data?.error || `Server Error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from server. Please check your connection.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || "An unexpected error occurred.";
  }
};
