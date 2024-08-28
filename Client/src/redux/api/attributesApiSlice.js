import { apiSlice } from "./apiSlice";
import { ATTRIBUTES_URL } from "../constans";

export const attributesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAttribute: builder.mutation({
      query: (data) => ({
        url: `${ATTRIBUTES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateAttribute: builder.mutation({
      query: ({ id, data }) => ({
        url: `${ATTRIBUTES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAttribute: builder.mutation({
      query: ({ id }) => ({
        url: `${ATTRIBUTES_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getAttributesPerType: builder.query({
      query: ({ id }) => ({
        url: `${ATTRIBUTES_URL}/perType/${id}`,
        method: "GET",
      }),
    }),
    getAttributes: builder.query({
      query: () => ({
        url: `${ATTRIBUTES_URL}`,
      }),
    }),
  }),
});
export const {
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useGetAttributesQuery,
  useGetAttributesPerTypeQuery,
} = attributesApiSlice;
