// appliedApi.js
import { baseApi } from "../../baseApi/baseApi";

const appliedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all applied jobs with pagination
    getAllAppliedJobs: builder.query({
      query: ({ page = 1, limit = 10, status = '', search = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        
        return `/job/get-all?${params.toString()}`;
      },
      transformResponse: (response) => {
        console.log('Applied Jobs API Response:', response);
        
        if (response?.data?.attributes) {
          return {
            jobs: Array.isArray(response.data.attributes) ? response.data.attributes : [response.data.attributes],
            total: response.data.attributes.length,
            page: 1,
            limit: 10
          };
        }
        
        return {
          jobs: [],
          total: 0,
          page: 1,
          limit: 10
        };
      },
      providesTags: ['AppliedJobs'],
    }),

    // Get applied job by ID
    getAppliedJobById: builder.query({
      query: (id) => `/job/get-single/${id}`,
      transformResponse: (response) => {
        if (response?.data?.attributes) {
          return response.data.attributes;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'AppliedJobs', id }],
    }),

    // Apply for a new job
    applyForJob: builder.mutation({
      query: (jobData) => ({
        url: '/job/create',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['AppliedJobs'],
    }),

    // Update applied job
    updateAppliedJob: builder.mutation({
      query: ({ id, ...jobData }) => ({
        url: `job/update/${id}`,
        method: 'PATCH',
        body: jobData,
      }),
      invalidatesTags: (result, error, { id }) => [
        'AppliedJobs',
        { type: 'AppliedJobs', id }
      ],
    }),

    // Delete applied job
    deleteAppliedJob: builder.mutation({
      query: (id) => ({
        url: `/job/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AppliedJobs'],
    }),

    // Update application status
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/job/update/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        'AppliedJobs',
        { type: 'AppliedJobs', id }
      ],
    }),
  }),
});

export const {
  useGetAllAppliedJobsQuery,
  useGetAppliedJobByIdQuery,
  useApplyForJobMutation,
  useUpdateAppliedJobMutation,
  useDeleteAppliedJobMutation,
  useUpdateApplicationStatusMutation,
} = appliedApi;