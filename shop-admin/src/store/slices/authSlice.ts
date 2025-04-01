import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../types";
import { auth } from "../../api/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const transformUser = (user: User | null): SerializableUser | null => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<SerializableUser | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.user = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;

export const login =
  (email: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(authSuccess(transformUser(userCredential.user)));
    } catch (error) {
      let errorMessage = "Failed to login";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(authFailure(errorMessage));
    }
  };

export const register =
  (email: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      dispatch(authSuccess(transformUser(userCredential.user)));
    } catch (error) {
      let errorMessage = "Failed to register";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(authFailure(errorMessage));
    }
  };

export const logout = (): AppThunk => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(logoutSuccess());
  } catch (error) {
    let errorMessage = "Failed to logout";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    dispatch(authFailure(errorMessage));
  }
};

export const listenToAuthChanges = (): AppThunk => (dispatch) => {
  auth.onAuthStateChanged((user) => {
    dispatch(authSuccess(transformUser(user)));
  });
};
