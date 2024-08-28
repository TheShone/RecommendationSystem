import React from "react";
import { RATINGS_URL } from "../constans";
import { apiSlice } from "./apiSlice";
export const ratingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query({
      query: (productId) => `${RATINGS_URL}/${productId}`,
    }),
    createRating: builder.mutation({
      query: (rating) => ({
        url: `${PRODUCTES_URL}`,
        method: "POST",
        body: rating,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});
export const {
    useGetRatingsQuery,
    useCreateRatingMutation,
} = ratingsApiSlice;
