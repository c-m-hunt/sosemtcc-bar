import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ClubDiscount } from "../types";
import * as api from "../api";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface DiscountState {
  loadStatus: RequestStatus;
  saveStatus: RequestStatus;
  discount?: ClubDiscount;
}

const initialState: DiscountState = {
  loadStatus: "idle",
  saveStatus: "idle",
  discount: undefined,
};

const discount = createSlice({
  name: "discount",
  initialState,
  reducers: {
    setDiscountLoading: (state, action) => {
      state.loadStatus = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDiscount.pending, (state) => {
      state.loadStatus = "loading";
    });
    builder.addCase(fetchDiscount.fulfilled, (state, action) => {
      state.loadStatus = "succeeded";
      if (action.payload) {
        state.discount = action.payload;
      }
    });
    builder.addCase(fetchDiscount.rejected, (state) => {
      state.loadStatus = "failed";
    });
    builder.addCase(insertDiscount.pending, (state) => {
      state.saveStatus = "loading";
    });
    builder.addCase(insertDiscount.fulfilled, (state, action) => {
      state.saveStatus = "succeeded";
    });
    builder.addCase(insertDiscount.rejected, (state) => {
      state.saveStatus = "failed";
    });
    builder.addCase(deleteDiscount.pending, (state) => {
      state.saveStatus = "loading";
    });
    builder.addCase(deleteDiscount.fulfilled, (state, action) => {
      state.saveStatus = "succeeded";
      state.discount = undefined;
    });
    builder.addCase(deleteDiscount.rejected, (state) => {
      state.saveStatus = "failed";
    });
  },
});

export const { setDiscountLoading, setDiscount } = discount.actions;

export default discount.reducer;
