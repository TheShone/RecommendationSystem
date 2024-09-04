import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PURCHASEHISTORY } from "../constans";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: order,
      }),
    }),
    createPurchase: builder.mutation({
      query: (data) => ({
        url: `${PURCHASEHISTORY}`,
        method: "POST",
        body: data,
      }),
    }),
    getOrder: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/order/${id}`,
      }),
    }),
    getMyOrders: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
      }),
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});
export const {
  useCreateOrderMutation,
  useCreatePurchaseMutation,
  useGetOrderQuery,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useUpdateOrderMutation,
} = orderApiSlice;
