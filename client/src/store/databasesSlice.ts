import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDatabases } from "../api/examApi";
import type { DatabaseInfo } from "../types";

interface DatabasesState {
  items: DatabaseInfo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

export type { DatabasesState };

const initialState: DatabasesState = {
  items: [],
  status: "idle",
};

export const loadDatabases = createAsyncThunk(
  "databases/load",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDatabases();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load databases";
      return rejectWithValue(message);
    }
  }
);

const databasesSlice = createSlice({
  name: "databases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDatabases.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(loadDatabases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadDatabases.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string | undefined) ||
          action.error.message ||
          "Failed to load databases";
      });
  },
});

export default databasesSlice.reducer;

