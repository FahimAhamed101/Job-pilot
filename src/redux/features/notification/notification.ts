// redux/features/notification/notification.ts
import { baseApi } from "../../baseApi/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: (params?: { page?: number; limit?: number; type?: string; read?: boolean }) => ({
        url: "/notifications",
        method: "GET",
        params: params || {},
      }),
      // Fix: Transform response to match frontend expectations
      transformResponse: (response: any) => {
        return {
          data: response.data, // This matches your backend response structure
          success: true
        };
      },
      providesTags: ['Notification'],
    }),

    markAsRead: builder.mutation({
      query: (notificationId: string) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ['Notification'],
    }),

    markAllAsRead: builder.mutation({
      query: (type?: string) => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
        body: type ? { type } : {},
      }),
      invalidatesTags: ['Notification'],
    }),

    getUnreadCount: builder.query({
      query: (type?: string) => ({
        url: "/notifications/unread-count",
        method: "GET",
        params: type ? { type } : {},
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { 
  useGetAllNotificationQuery, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation,
  useGetUnreadCountQuery 
} = notificationApi;