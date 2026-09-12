import { 
  createContext, 
  useContext, 
  ReactNode, 
  useState, 
  useEffect,
  createElement, 
  PropsWithChildren
} from "react";
import { User } from "@/lib/types";
import { getStoredAuth, storeAuth, clearAuth, updateViewingRole } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  viewingAs: "customer" | "farmer" | "admin";
  isLoading: boolean;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  toggleRole: (role: "customer" | "farmer") => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<{
    user: User | null;
    token: string | null;
    viewingAs: "customer" | "farmer";
  }>({
    user: null,
    token: null,
    viewingAs: "customer",
  });

  useEffect(() => {
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      setAuthState({
        user: storedAuth.user,
        token: storedAuth.token,
        viewingAs: storedAuth.viewingAs,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (data: { user: User; token: string }) => {
    const { user, token } = data;
    const viewingAs = user.role as "customer" | "farmer";

    setAuthState({
      user,
      token,
      viewingAs,
    });

    storeAuth(user, token, viewingAs);
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      viewingAs: "customer",
    });
    clearAuth();
    
    // Note: Cart clearing is now handled in the Header component
    // when the logout button is clicked by calling clearCart()
    // from the CartContext. This is more robust than clearing
    // localStorage directly, as it properly updates state.
  };

  const toggleRole = (role: "customer" | "farmer") => {
    // Allow any user to toggle, but they can only view as "farmer" if they have that role
    if (authState.user) {
      console.log("toggleRole called with:", role);
      console.log("Current user role:", authState.user.role);
      
      // Admin can toggle to any view
      if (authState.user.role === "admin") {
        console.log("Admin can toggle to any view");
        setAuthState((prev) => ({
          ...prev,
          viewingAs: role,
        }));
        updateViewingRole(role);
        return;
      }
      
      // Only allow switching to farmer view if user has the farmer role
      if (role === "farmer" && authState.user.role !== "farmer") {
        console.log("Cannot toggle to farmer view: user is not a farmer");
        return; // Don't allow customer to view as farmer
      }
      
      console.log("Toggling view to:", role);
      setAuthState((prev) => ({
        ...prev,
        viewingAs: role,
      }));
      updateViewingRole(role);
    }
  };

  const refreshUser = async () => {
    if (!authState.token) return;
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
        }));
        
        // Update localStorage with fresh user data
        if (updatedUser) {
          storeAuth(updatedUser, authState.token!, authState.viewingAs);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user: authState.user,
    token: authState.token,
    viewingAs: authState.viewingAs,
    isLoading,
    login,
    logout,
    toggleRole,
    refreshUser,
  };

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};