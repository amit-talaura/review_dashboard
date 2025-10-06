import { createSlice } from "@reduxjs/toolkit";
import { getLoginDispatcher } from "./LoginDispatcher";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoginDispatcher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoginDispatcher.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(getLoginDispatcher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, setLoading } = authSlice.actions;

export default authSlice;
