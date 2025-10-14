import { baseApi } from "../../baseApi/baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsCondition: builder.query({
      query: () => ({
        url: "/term_condition",
        method: "GET",
      }),
      providesTags: ["TermsAndConditions"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    editeTrmas: builder.mutation({
      query: (body) => ({
        url: "/term_condition",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TermsAndConditions"],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/privacy_policy",
        method: "GET",
      }),
      providesTags: ["privacyPolicy"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    editePrivacy: builder.mutation({
      query: (data) => ({
        url: "/privacy_policy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["privacyPolicy"],
    }),

    getAboutUs: builder.query({
      query: () => ({
        url: "/about",
        method: "GET",
      }),
      providesTags: ["aboutus"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    createAndPostAbout: builder.mutation({
      query: ({ data }) => ({
        url: "/about",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["aboutus"],
    }),

    getLegalNotice: builder.query({
      query: () => ({
        url: "/legal",
        method: "GET",
      }),
      providesTags: ["LegalNotice"],
    }),
    editeLegalNotice: builder.mutation({
      query: ({ data }) => ({
        url: "/legal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LegalNotice"],
    }),
  }),
});

export const {
  useGetTermsConditionQuery,
  useEditeTrmasMutation,
  useGetPrivacyPolicyQuery,
  useEditePrivacyMutation,
  useGetAboutUsQuery,
  useCreateAndPostAboutMutation,
  useGetLegalNoticeQuery,
  useEditeLegalNoticeMutation,
} = settingApi;
