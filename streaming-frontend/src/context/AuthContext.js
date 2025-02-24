import React, { createContext, useState, useEffect } from "react";
import api, { loginUser, registerUser, getUserProfile, setAuthToken } from "../services/api";

export const AuthContext = createContext(); // ✅ Named export

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token); // ✅ Ensures token is set in headers
          const userData = await getUserProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials.email, credentials.password);
      localStorage.setItem("token", response.token);
      setAuthToken(response.token); // ✅ Set token in headers
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: error };
    }
  };

  const register = async (userData) => {
    try {
      await registerUser(userData);
      return { success: true, message: "Registration successful!" };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, message: error };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null); // ✅ Removes auth header
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // ✅ Default export should be AuthProvider
