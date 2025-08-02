import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Route = 'home' | 'chat' | 'profile';

export interface PageState {
  currentPage: Route;
}

const initialState: PageState = {
  currentPage: 'home',
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<Route>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = pageSlice.actions;
export default pageSlice.reducer;
