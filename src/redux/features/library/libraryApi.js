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

    // Delete library item (keep this as it doesn't involve file upload)
    deleteLibraryItem: builder.mutation({
      query: (id) => ({
        url: `/library/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Library'],
    }),

    // REMOVED: addLibraryItem and updateLibraryItem mutations
    // We'll use custom functions for file uploads instead
  }),
});

export const {
  useGetAllLibraryItemsQuery,
  useDeleteLibraryItemMutation,
  // REMOVED: useAddLibraryItemMutation, useUpdateLibraryItemMutation
} = libraryApi;