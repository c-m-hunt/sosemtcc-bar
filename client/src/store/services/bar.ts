import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "./../../config";
import { Order } from "square";
import { ClubDiscount, CoreResponse } from "../../types";
import { RootState } from "../store";

export const DISCOUNT_REDUCER = "discount";

export const DISCOUNT_TAG = "DISCOUNT";
export const ORDER_TAG = "ORDER";

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).app.key;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const barApi = createApi({
  reducerPath: DISCOUNT_REDUCER,
  baseQuery,
  tagTypes: [DISCOUNT_TAG, ORDER_TAG],
  endpoints: (builder) => ({
    fetchCore: builder.query<CoreResponse, void>({
      query: (b) => ({
        url: `core`,
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
  useFetchCoreQuery,
  useLazyFetchCoreQuery,
  useInsertDiscountMutation,
  useDeleteDiscountMutation,
  useFetchOrdersQuery,
} = barApi;
