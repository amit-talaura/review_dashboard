import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/login/LoginSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  devTools: import.meta.env.MODE !== "production",
});
