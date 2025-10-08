import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/login/LoginSlice";
import InsightSlice from "../features/insight/InsightSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    insight: InsightSlice.reducer,
  },
  devTools: import.meta.env.MODE !== "production",
});
