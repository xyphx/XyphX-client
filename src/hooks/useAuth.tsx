import React, { createContext, useContext, useEffect, useState } from "react";

// Dummy user type to replace Firebase User
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent dummy login
    const storedUser = localStorage.getItem('dummyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = async () => {
    try {
      // Simulate network delay
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const dummyUser: User = {
        uid: "dummy-admin-123",
        email: "admin@xyphx.com",
        displayName: "XyphX Admin",
        photoURL: null,
      };

      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      setIsAdmin(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      localStorage.removeItem('dummyUser');
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
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
