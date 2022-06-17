import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CategoryState {
  categories: string[];
}

const initialState: CategoryState = {
  categories: ['others'],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, data: PayloadAction<{ name: string }>) => {
      state.categories = [data.payload.name, ...state.categories];
    },
    deleteCategory: (state, data: PayloadAction<{ name: string }>) => {
      const categories = [...state.categories];
      const index = categories.indexOf(data.payload.name);
      if (index > -1) {
        categories.splice(index, 1);
      }
      state.categories = categories;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCategory, deleteCategory } = categorySlice.actions;

export default categorySlice.reducer;
