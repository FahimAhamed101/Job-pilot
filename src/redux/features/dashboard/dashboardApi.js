// dashboardApi.js
import { baseApi } from "../../baseApi/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => '/job/dashboard-data',
      transformResponse: (response) => {
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        return response;
      },
    }),

    getRecentJobApplications: builder.query({
      query: ({ page = 1, limit = 5, status } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && { status })
        });
        return `/job/get-all?${params.toString()}`;
      },
      transformResponse: (response) => {
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ['RecentJobs'],
    }),

    getLatestUsers: builder.query({
      query: ({ limit = 5 } = {}) => `/users/latest?limit=${limit}`,
      transformResponse: (response) => {
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ['LatestUsers'],
    }),

    // Add library endpoints to dashboard API
    getLibraryItems: builder.query({
      query: () => '/library/get-all',
      transformResponse: (response) => {
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        return [];
      },
      providesTags: ['Library'],
    }),

    // ... your other existing endpoints
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetRecentJobApplicationsQuery,
  useGetLatestUsersQuery,
  useGetLibraryItemsQuery,
  useGetTotalUserQuery,
  useGetTotalRevenuQuery,
  useGetTotalSubscriptionQuery,
  useGetIncomeRatioQuery,
} = dashboardApi;