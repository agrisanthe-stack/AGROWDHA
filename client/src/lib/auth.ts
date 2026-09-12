import { User } from "./types";

// Storage key for auth data
const AUTH_STORAGE_KEY = "harvest_direct_auth";

// Get the stored auth data
export const getStoredAuth = (): { 
  user: User | null; 
  token: string | null;
  viewingAs: "customer" | "farmer"; 
} => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      return JSON.parse(authData);
    }
  } catch (error) {
    console.error("Failed to parse auth data:", error);
  }
  
  return { user: null, token: null, viewingAs: "customer" };
};

// Get the auth token regardless of whether it's stored in localStorage
export const getAuthToken = (): string | null => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.token;
    }
  } catch (error) {
    console.error("Failed to get auth token:", error);
  }
  
  return null;
};

// Store the auth data
export const storeAuth = (user: User, token: string, viewingAs: "customer" | "farmer" = "customer") => {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user, token, viewingAs })
    );
  } catch (error) {
    console.error("Failed to store auth data:", error);
  }
};

// Clear the stored auth data
export const clearAuth = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear auth data:", error);
  }
};

// Update the viewing role
export const updateViewingRole = (viewingAs: "customer" | "farmer") => {
  try {
    const authData = getStoredAuth();
    if (authData.user) {
      storeAuth(authData.user, authData.token || "", viewingAs);
    }
  } catch (error) {
    console.error("Failed to update viewing role:", error);
  }
};
