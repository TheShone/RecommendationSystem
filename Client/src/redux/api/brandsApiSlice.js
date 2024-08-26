import { apiSlice } from "./apiSlice";
import { BRANDS_URL } from "../constans";

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (data) => ({
        url: `${BRANDS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BRANDS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteBrand: builder.mutation({
      query: ({ id }) => ({
        url: `${BRANDS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getBrands: builder.query({
      query: () => ({
        url: `${BRANDS_URL}`,
      }),
    }),
  }),
});
export const {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
} = brandsApiSlice;
