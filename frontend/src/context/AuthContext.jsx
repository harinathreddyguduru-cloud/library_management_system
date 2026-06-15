import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("library_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("library_user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem("library_token", data.token);
      localStorage.setItem("library_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (info) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: info.name,
        email: info.email,
        password: info.password,
        roll_number: info.rollNumber || info.studentId,
        department: info.department,
        semester: info.semester || "1",
        phone: info.phone || "",
      };
      await authAPI.register(payload);
      const userData = await authAPI.login({ email: info.email, password: info.password });
      localStorage.setItem("library_token", userData.data.token);
      localStorage.setItem("library_user", JSON.stringify(userData.data.user));
      setUser(userData.data.user);
      return userData.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore logout endpoint errors
    }
    localStorage.removeItem("library_token");
    localStorage.removeItem("library_user");
    setUser(null);
  }, []);

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
