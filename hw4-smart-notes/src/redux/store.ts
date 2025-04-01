// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notesSlice";
import tagsReducer from "./tagsSlice";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    tags: tagsReducer,
  },
});

export default store;
