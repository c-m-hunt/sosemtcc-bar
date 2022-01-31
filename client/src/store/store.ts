import { configureStore } from "@reduxjs/toolkit";
import discountReducer, { DiscountState } from "./discount";

export interface RootState {
  discount: DiscountState;
}

const reducer = {
  discount: discountReducer,
};

export const store = configureStore({
  reducer,
});
