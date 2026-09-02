export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data?.message || error.response.data?.error || `Server Error: ${error.response.status}`;
  } else if (error.request) {
    return "No response from server. Please check your connection.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};
