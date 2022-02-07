import { configureStore } from "@reduxjs/toolkit";
import { barApi } from "./services/bar";
import appReducer, { appSlice } from "./appSlice";

const reducer = {
  [barApi.reducerPath]: barApi.reducer,
  [appSlice.name]: appReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
