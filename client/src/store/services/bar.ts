import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "square";
import { ClubDiscount } from "../../types";

export const DISCOUNT_REDUCER = "discount";

export const DISCOUNT_TAG = "DISCOUNT";
export const ORDER_TAG = "ORDER";

export const barApi = createApi({
  reducerPath: DISCOUNT_REDUCER,
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3030/api/" }),
  tagTypes: [DISCOUNT_TAG, ORDER_TAG],
  endpoints: (builder) => ({
    fetchDiscount: builder.query<ClubDiscount[], void>({
      query: () => ({
        url: `discount`,
        method: "GET",
      }),
      providesTags: [DISCOUNT_TAG],
    }),
    insertDiscount: builder.mutation<ClubDiscount[], void>({
      query: () => ({
        url: `discount`,
        method: "POST",
      }),
      invalidatesTags: [DISCOUNT_TAG],
    }),
    deleteDiscount: builder.mutation<ClubDiscount[], void>({
      query: () => ({
        url: `discount`,
        method: "DELETE",
      }),
      transformResponse: () => [],
      invalidatesTags: [DISCOUNT_TAG],
    }),
    fetchOrders: builder.query<Order[], void>({
      query: () => ({
        url: `orders`,
        method: "GET",
      }),
      providesTags: [ORDER_TAG],
    }),
  }),
});

export const {
  useFetchDiscountQuery,
  useInsertDiscountMutation,
  useDeleteDiscountMutation,
  useFetchOrdersQuery,
} = barApi;
