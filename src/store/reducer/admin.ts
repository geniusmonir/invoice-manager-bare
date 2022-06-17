import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminAccountState {
  username: string;
  password: string;
  isAuthenticated?: boolean;
  verified?: boolean;
}

const initialState: AdminAccountState = {
  username: 'ADMIN',
  password: 'password',
  isAuthenticated: false,
  verified: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    authenticateAdmin: (state, data: PayloadAction<AdminAccountState>) => {
      if (
        data.payload.username === state.username &&
        data.payload.password === state.password
      ) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },

    resetAuth: (state) => {
      state.isAuthenticated = false;
    },

    adminVerification: (state, data: PayloadAction<{ verified: boolean }>) => {
      state.verified = data.payload.verified;
    },
  },
});

// Action creators are generated for each case reducer function
export const { authenticateAdmin, resetAuth, adminVerification } =
  adminSlice.actions;

export default adminSlice.reducer;
