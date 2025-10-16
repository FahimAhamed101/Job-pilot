// libraryApi.js
import { baseApi } from "../../baseApi/baseApi";

const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all library items
    getAllLibraryItems: builder.query({
      query: () => '/library/get-all',
      transformResponse: (response) => {
        console.log('Library API Response:', response);
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ['Library'],
    }),

    // Add library item with file upload
    addLibraryItem: builder.mutation({
      query: (formData) => ({
        url: '/library/create',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it automatically for FormData
        headers: {
          // Remove 'Content-Type' to let browser set it with boundary
        },
      }),
      invalidatesTags: ['Library'],
    }),

    // Update library item with file upload
    updateLibraryItem: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/library/update/${id}`,
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header - let browser set it automatically for FormData
        headers: {
          // Remove 'Content-Type' to let browser set it with boundary
        },
      }),
      invalidatesTags: ['Library'],
    }),

    // Delete library item
    deleteLibraryItem: builder.mutation({
      query: (id) => ({
        url: `/library/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Library'],
    }),
  }),
});

export const {
  useGetAllLibraryItemsQuery,
  useDeleteLibraryItemMutation,
  useAddLibraryItemMutation,
  useUpdateLibraryItemMutation
} = libraryApi;