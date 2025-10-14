// privacyPolicyApi.js
import { baseApi } from "../../baseApi/baseApi";

const privacyPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get privacy policy
    getPrivacyPolicy: builder.query({
      query: () => '/privacy-policy/read',
      transformResponse: (response) => {
        console.log('Privacy Policy API Response:', response);
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        if (response?.data) {
          return response.data;
        }
        return null;
      },
      providesTags: ['PrivacyPolicy'],
    }),

    // Create privacy policy
    createPrivacyPolicy: builder.mutation({
      query: (privacyData) => ({
        url: '/privacy-policy/create',
        method: 'POST',
        body: privacyData,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),

    // Update privacy policy
    updatePrivacyPolicy: builder.mutation({
      query: ({ id, privacyData }) => ({
        url: `/privacy-policy/update/${id}`,
        method: 'PATCH',
        body: privacyData,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useCreatePrivacyPolicyMutation,
  useUpdatePrivacyPolicyMutation,
} = privacyPolicyApi;