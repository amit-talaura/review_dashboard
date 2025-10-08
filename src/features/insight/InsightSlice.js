import { createSlice } from "@reduxjs/toolkit";
import { getUserByStoreDispatcher } from "./InsightDispatcher";

const initialState = {
  data: {
    userbystoreData: null,
  },
  status: {
    userbystoreLoading: false,
  },
  errors: {
    userbystoreError: null,
  },
};

const thunkMap = [
  {
    dispatcher: getUserByStoreDispatcher,
    dataKey: "userbystoreData",
    loadingKey: "userbystoreLoading",
    errorKey: "userbystoreError",
  },
];

const insights = createSlice({
  name: "insights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    thunkMap.forEach(({ dispatcher, dataKey, loadingKey, errorKey }) => {
      builder
        .addCase(dispatcher.pending, (state) => {
          state.status[loadingKey] = true;
        })
        .addCase(dispatcher.fulfilled, (state, action) => {
          state.status[loadingKey] = false;
          state.data[dataKey] = action.payload;
        })
        .addCase(dispatcher.rejected, (state, action) => {
          state.data[loadingKey] = false;
          state.errors[errorKey] =
            action?.error?.message || "Something went wrong!";
        });
    });
  },
});

export default insights;
