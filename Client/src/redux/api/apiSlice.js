import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { BASE_URL } from "../constans";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = Cookies.get("jwt");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "ProductType", "Brand", "Rating"],
  endpoints: () => ({}),
});
