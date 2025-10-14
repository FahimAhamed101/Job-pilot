import { baseApi } from "../../baseApi/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: (page) => {
        const params = page ? `?page=${page}&limit=10` : "";
        return {
          // url: `/users/all${params}`,
          url: `/payment/transactions/${params}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data,
    }),

    getSingleEarnings: builder.query({
      query: (id) => ({
        url: `/payment/transactions/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useGetEarningsQuery, useGetSingleEarningsQuery } = earningsApi;
