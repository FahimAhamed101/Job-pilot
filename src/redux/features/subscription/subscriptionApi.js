import { baseApi } from "../../baseApi/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: 'GET',
      }),
    }),

    getAllSubscription: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && Array.isArray(args)) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: '/subscription',
          method: 'GET',
          params,
        };
      },
    }),

    addSubscription: builder.mutation({
      query: (subscriptionData) => ({
        url: '/subscription/create',
        method: 'POST',
        body: subscriptionData, 
      }),
    }),

    subscriptionUpdate: builder.mutation({
      query: ({ id, subscriptionData }) => ({
        url: `/subscription/${id}`,
        method: 'PUT',
        body: subscriptionData,
      }),
    }),

    deleteSubscription:builder.mutation({
        query:(id)=>({
            url:`/subscription/${id}`,
            method: 'DELETE',
        })
    })
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetAllSubscriptionQuery,
  useAddSubscriptionMutation,
  useSubscriptionUpdateMutation,
  useDeleteSubscriptionMutation
} = subscriptionApi;
