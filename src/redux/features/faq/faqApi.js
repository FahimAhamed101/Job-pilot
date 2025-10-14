// faqApi.js
import { baseApi } from "../../baseApi/baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all FAQs
    getAllFaqs: builder.query({
      query: () => '/faq/read-all',
      transformResponse: (response) => {
        console.log('FAQ API Response:', response);
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ['FAQ'],
    }),

    // Create new FAQ
    createFaq: builder.mutation({
      query: (faqData) => ({
        url: '/faq/create',
        method: 'POST',
        body: faqData,
      }),
      invalidatesTags: ['FAQ'],
    }),

    // Update FAQ
    updateFaq: builder.mutation({
      query: ({ id, faqData }) => ({
        url: `/faq/update/${id}`,
        method: 'PATCH',
        body: faqData,
      }),
      invalidatesTags: ['FAQ'],
    }),

    // Delete FAQ
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faq/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'],
    }),
  }),
});

export const {
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;