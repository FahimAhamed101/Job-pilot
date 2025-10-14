
import { baseApi } from "../../baseApi/baseApi";

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReports: builder.query({
      query: () => ({
        url: "/report",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes?.results,
    }),

    getReportDetails: builder.query({
        query:(id)=>({
            url:`/report/${id}`,
            method:"GET",
        }),
        transformResponse: (response) => response?.data?.attributes
    })
     
  }),
});

export const { useGetAllReportsQuery, useGetReportDetailsQuery } = reportApi;