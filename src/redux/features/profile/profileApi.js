// profileApi.js
import { baseApi } from "../../baseApi/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),

    uploadProfileImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('profileImage', file);
        return {
          url: '/user/upload-profile-image',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadProfileImageMutation,
} = profileApi;