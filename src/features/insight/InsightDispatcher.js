import { createAsyncThunk } from "@reduxjs/toolkit";
import Services from "../../network/services/Index";

export const getUserByStoreDispatcher = createAsyncThunk(
  "getUserBy Store",
  async (id) => {
    try {
      return Services.InsightServices.getUserByStore(id);
    } catch (error) {
      return { error: JSON.parse(JSON.stringify(error)) };
    }
  }
);
