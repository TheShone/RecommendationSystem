import { apiSlice } from "./apiSlice";
import { PRODUCT_TYPES_URL } from "../constans";

export const productTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProductType: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_TYPES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateProductType: builder.mutation({
      query: ({ id, data }) => ({
        url: `${PRODUCT_TYPES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteProductType: builder.mutation({
      query: ({ id }) => ({
        url: `${PRODUCT_TYPES_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getProductTypes: builder.query({
      query: () => ({
        url: `${PRODUCT_TYPES_URL}`,
      }),
    }),
  }),
});
export const {
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
  useGetProductTypesQuery,
} = productTypesApiSlice;
