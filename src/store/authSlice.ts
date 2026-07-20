import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user?: User; isAdmin?: boolean }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      if (action.payload.isAdmin !== undefined) {
        state.isAdmin = action.payload.isAdmin;
      }
      state.isAuthenticated = true;
    },
    updateUser: (
      state,
      action: PayloadAction<{ user: User; isAdmin: boolean }>
    ) => {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    }
  },
});

export const { setCredentials, updateUser, logout, setInitialized } = authSlice.actions;

export default authSlice.reducer;
