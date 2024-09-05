import React from "react";
import { PRODUCTES_URL, RECOMMENDATION_URL, RATINGS_URL } from "../constans";
import { PRODUCT_ATTRIBUTES_URL } from "../constans";
import { apiSlice } from "./apiSlice";
export const productesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCTES_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) => `${PRODUCTES_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    allProducts: builder.query({
      query: () => `${PRODUCTES_URL}/all`,
    }),
    topProducts: builder.query({
      query: () => `${PRODUCTES_URL}/top`,
    }),
    filteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTES_URL}/filtered`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTES_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCTES_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCTES_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTES_URL}/${id}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),
    createProductAttribute: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_ATTRIBUTES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getProductAttributes: builder.query({
      query: (id) => ({
        url: `${PRODUCT_ATTRIBUTES_URL}/${id}`,
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${RATINGS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getReviews: builder.query({
      query: (id) => ({
        url: `${RATINGS_URL}/${id}`,
      }),
    }),
    getRecommendations: builder.query({
      query: (id) => ({
        url: `${RECOMMENDATION_URL}/${id}`,
      }),
    }),
  }),
});
export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useTopProductsQuery,
  useAllProductsQuery,
  useFilteredProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductAttributeMutation,
  useGetProductAttributesQuery,
  useCreateReviewMutation,
  useGetReviewsQuery,
  useGetRecommendationsQuery,
} = productesApiSlice;
