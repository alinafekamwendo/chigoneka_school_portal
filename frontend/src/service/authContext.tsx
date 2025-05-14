import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "./authService";

interface AuthContextType {
  user: authService.User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: {
    username: string;
    password: string;
    email: string;
    name: string;
    role: string;
  }) => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  hasRole: (role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<authService.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = authService.getAccessToken();

    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        if (isMounted) {
          authService.clearTokens();
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      if (response.token) {
        authService.storeTokens(response.token); // Store the token
      } else {
        console.error("Token is undefined");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      authService.clearTokens(); // Clear tokens
    } finally {
      setLoading(false);
    }
  };


  const signup = async (userData: {
    username: string;
    password: string;
    email: string;
    name: string;
    role: string;
  }) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(userData);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = async () => {
    return user !== null || (await authService.isAuthenticated());
  };

  const hasRole = async (role: string) => {
    return user?.role === role || (await authService.hasRole(role));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

//usage example
// import { login } from "../services/authService";

// const handleLogin = async (username: string, password: string) => {
//   try {
//     const response = await login({ username, password });
//     console.log("Login successful", response.user);
//   } catch (error) {
//     console.error("Login failed", error);
//   }
// };
