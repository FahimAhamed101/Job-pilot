import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely parse localStorage
const getStoredItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const initialState = {
  token: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: getStoredItem("user"),
  role: getStoredItem("user")?.role || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedUser(state, action) {
      const response = action.payload;
      console.log('Redux - Processing login response:', response);
      
      // Extract data based on your exact API response structure
      if (response.data && response.data.attributes) {
        const { user, tokens } = response.data.attributes;
        
        state.token = tokens?.accessToken;
        state.refreshToken = tokens?.refreshToken;
        state.user = user;
        state.role = user?.role || null;
        state.isAuthenticated = true;

        // Save to localStorage
        if (state.token) {
          localStorage.setItem("accessToken", state.token);
        }
        if (state.refreshToken) {
          localStorage.setItem("refreshToken", state.refreshToken);
        }
        if (state.user) {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
        
        console.log('Redux - User logged in successfully:', { 
          role: state.role, 
          hasToken: !!state.token,
          user: state.user 
        });
      }
    },
    
    updateUser(state, action) {
      state.user = action.payload;
      state.role = action.payload?.role || state.role;
      
      // Update localStorage
      if (state.user) {
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    
    updateToken(state, action) {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      
      // Update localStorage
      if (state.token) {
        localStorage.setItem("accessToken", state.token);
      }
      if (state.refreshToken) {
        localStorage.setItem("refreshToken", state.refreshToken);
      }
    },
    
    logoutUser(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      console.log('Redux - User logged out');
    },
  },
});

export const { loggedUser, updateUser, updateToken, logoutUser } = authSlice.actions;

// Selectors for easy access
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;