import { baseApi } from "../../baseApi/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (formdata) => {
        return {
          url: "/admin/product",
          method: "POST",
          body: formdata,
        };
      },
      providesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/products/all",
        method: "GET",
      }),
      invalidatesTags: ["Products"],
      transformResponse: (response) => response?.data?.attributes?.data,
    }),
    getAllProductRequest: builder.query({
      query: () => ({
        url: "/products/product_request",
        method: "GET",
      }),
      invalidatesTags: ["Products"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Products"],
      transformResponse: (response) => response?.data?.attributes,
    }),

    approveProduct: builder.mutation({
      query: (id) => ({
        url: `/products/approve/${id}`,
        method: "POST",
      }),
      providesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formdata }) => {
        return {
          url: `/admin/product/${id}`,
          method: "PATCH",
          body: formdata,
        };
      },
      providesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useApproveProductMutation,
  useGetAllProductRequestQuery,
} = productApi;
