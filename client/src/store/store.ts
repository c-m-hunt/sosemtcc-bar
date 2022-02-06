import { configureStore } from "@reduxjs/toolkit";
import { barApi } from "./services/bar";

const reducer = {
  [barApi.reducerPath]: barApi.reducer,
};

export const store = configureStore({
  reducer,
});
