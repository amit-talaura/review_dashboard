import { createAsyncThunk } from "@reduxjs/toolkit";
import Services from "../../network/services/Index";

export const getLoginDispatcher = createAsyncThunk(
  "auth/getLogin",
  async (body, { rejectWithValue }) => {
    try {
      const response = await Services.LoginServices.getLogin(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
