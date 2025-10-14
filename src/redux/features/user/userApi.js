// userApi.js
import { baseApi } from "../../baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filtering
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, role = '', search = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (role) params.append('role', role);
        if (search) params.append('search', search);
        
        return `/user?${params.toString()}`;
      },
      transformResponse: (response) => {
        console.log('Users API Response:', response);
        
        // Handle different response structures
        if (response?.data?.attributes) {
          // If attributes is an array
          if (Array.isArray(response.data.attributes)) {
            return {
              users: response.data.attributes,
              total: response.data.attributes.length,
              page: 1,
              limit: 10
            };
          } 
          // If attributes is a single object
          else if (typeof response.data.attributes === 'object') {
            return {
              users: [response.data.attributes],
              total: 1,
              page: 1,
              limit: 10
            };
          }
        }
        
        // If response is directly an array
        if (Array.isArray(response)) {
          return {
            users: response,
            total: response.length,
            page: 1,
            limit: 10
          };
        }
        
        // If response has users array
        if (response?.users) {
          return {
            users: response.users,
            total: response.total || response.users.length,
            page: response.page || 1,
            limit: response.limit || 10
          };
        }
        
        // Fallback
        return {
          users: [],
          total: 0,
          page: 1,
          limit: 10
        };
      },
      providesTags: ['Users'],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => `/user/${id}`,
      transformResponse: (response) => {
        return response?.data?.attributes || response;
      },
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // Create user with file upload support
    createUser: builder.mutation({
      query: (userData) => {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(userData).forEach(key => {
          if (userData[key] !== null && userData[key] !== undefined) {
            if (key === 'profileImage' || key === 'CV') {
              // Handle file uploads
              if (userData[key] instanceof File) {
                formData.append(key, userData[key]);
              }
            } else {
              formData.append(key, userData[key]);
            }
          }
        });

        return {
          url: '/user/create-user',
          method: 'POST',
          body: formData,
          formData: true, // Important for file uploads
        };
      },
      invalidatesTags: ['Users'],
    }),

    // Update user with file upload support
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(userData).forEach(key => {
          if (userData[key] !== null && userData[key] !== undefined) {
            if (key === 'profileImage' || key === 'CV') {
              // Handle file uploads
              if (userData[key] instanceof File) {
                formData.append(key, userData[key]);
              } else if (userData[key]) {
                // If it's a string (existing file path), still send it
                formData.append(key, userData[key]);
              }
            } else {
              formData.append(key, userData[key]);
            }
          }
        });

        return {
          url: `/user/profile-update/${id}`,
          method: 'PATCH',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        'Users',
        { type: 'Users', id }
      ],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Block/Unblock user
    toggleBlockUser: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/user/${id}/block`,
        method: 'PATCH',
        body: { isBlocked },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Users',
        { type: 'Users', id }
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleBlockUserMutation,
} = userApi;