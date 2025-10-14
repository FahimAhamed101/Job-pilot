// paymentApi.js
import { baseApi } from "../../baseApi/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payments
    getAllPayments: builder.query({
      query: () => '/payment/read-all',
      transformResponse: (response) => {
        console.log('Payment API Response:', response);
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ['Payment'],
    }),

    // Create new payment
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payment/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),

    // Update payment
    updatePayment: builder.mutation({
      query: ({ id, paymentData }) => ({
        url: `/payment/update/${id}`,
        method: 'PATCH',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),

    // Delete payment
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payment/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApi;