import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  profile: string;
}

export interface UserState {
  currentUser: User;
  currentRecipient: User | null;
}

const initialState: UserState = {
  currentUser: {
    id: 1,
    name: 'Alisha',
    profile: 'https://randomuser.me/api/portraits/women/89.jpg',
  },
  currentRecipient: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setCurrentRecipient: (state, action: PayloadAction<User | null>) => {
      state.currentRecipient = action.payload;
    },
  },
});

export const { setCurrentUser, setCurrentRecipient } = userSlice.actions;
export default userSlice.reducer;
