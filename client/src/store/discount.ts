import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ClubDiscount } from "../types";
import * as api from "../api";

export interface DiscountState {
  loadStatus: "idle" | "loading" | "succeeded" | "failed";
  discount?: ClubDiscount;
}

const initialState: DiscountState = {
  loadStatus: "idle",
  discount: undefined,
};

export const fetchDiscount = createAsyncThunk(
  "discount/getDiscount",
  async () => {
    try {
      const discount = await api.fetchDiscount();
      return discount as ClubDiscount;
    } catch (ex) {
      return undefined;
    }
  }
);

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
  },
});

export const { setDiscountLoading, setDiscount } = discount.actions;

export default discount.reducer;
