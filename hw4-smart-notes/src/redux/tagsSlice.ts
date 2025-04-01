// src/redux/tagsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface Tag {
  id: string;
  name: string;
  count: number; // Количество заметок с этим тегом
}

interface TagsState {
  tags: Tag[];
}

const initialState: TagsState = {
  tags: [],
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    addTag: {
      reducer(state, action: PayloadAction<Tag>) {
        state.tags.push(action.payload);
      },
      prepare(name: string) {
        return { payload: { id: uuidv4(), name, count: 0 } };
      },
    },
    deleteTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((tag) => tag.id !== action.payload);
    },
    renameTag(state, action: PayloadAction<{ id: string; name: string }>) {
      const index = state.tags.findIndex((tag) => tag.id === action.payload.id);
      if (index !== -1) {
        state.tags[index].name = action.payload.name;
      }
    },
  },
});

export const { addTag, deleteTag, renameTag } = tagsSlice.actions;
export default tagsSlice.reducer;
