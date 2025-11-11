import { configureStore } from "@reduxjs/toolkit";
import databasesReducer from "./databasesSlice";
import quizReducer from "./quizSlice";

export const store = configureStore({
  reducer: {
    databases: databasesReducer,
    quiz: quizReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

