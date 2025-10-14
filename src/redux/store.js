import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { baseApi } from "./baseApi/baseApi";

// Load state from localStorage
const loadState = () => {
  try {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      return {
        auth: {
          token,
          refreshToken,
          user: JSON.parse(user),
          role: JSON.parse(user).role,
          isAuthenticated: true,
        },
      };
    }
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
  }
  return undefined;
};

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  preloadedState: loadState(),
});

// Subscribe to store changes to persist auth state
store.subscribe(() => {
  const state = store.getState();
  const { token, refreshToken, user } = state.auth;
  
  if (token && user) {
    localStorage.setItem("accessToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
});

export default store;