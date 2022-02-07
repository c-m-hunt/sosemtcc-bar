import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getKeyFromLocalStorage } from "../utils";

export interface AppState {
  key?: string;
}

const keyFromLocalStorage = getKeyFromLocalStorage();

const initialState = {
  key: keyFromLocalStorage || undefined,
} as AppState;

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setKey: (state: AppState, action: PayloadAction<string>) => {
      state.key = action.payload;
    },
  },
});

export const { setKey } = appSlice.actions;

export default appSlice.reducer;
