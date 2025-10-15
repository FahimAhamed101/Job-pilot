import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create base query with better error handling
const baseQuery = fetchBaseQuery({
  baseUrl: "https://daughters-flame-configured-map.trycloudflare.com/api/v1",
  prepareHeaders: (headers, { getState }) => {
    // Try to get token from Redux store first
    const token = getState().auth?.token;
    
    // Fallback to localStorage if Redux store doesn't have token
    if (!token) {
      const localToken = localStorage.getItem("accessToken");
      if (localToken) {
        headers.set("Authorization", `Bearer ${localToken}`);
        console.log('Using token from localStorage');
      }
    } else {
      headers.set("Authorization", `Bearer ${token}`);
      console.log('Using token from Redux store');
    }
    
    // Add common headers
   
    headers.set("Accept", "application/json");
    headers.set("ngrok-skip-browser-warning", "true"); // Add this for ngrok
    
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Log API calls for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('API Call:', {
        url: args.url,
        method: args.method,
        status: result.meta?.response?.status,
        success: !result.error
      });
    }
    
    return result;
  },
  tagTypes: [
    "User", 
    "Categories", 
    "aboutus", 
    "Products", 
    "privacePolicy", 
    "TermsAndConditions", 
    "Subscription", 
    "Earnings", 
    "ProductRequest", 
    "Notification"
  ],
  endpoints: () => ({}),
});