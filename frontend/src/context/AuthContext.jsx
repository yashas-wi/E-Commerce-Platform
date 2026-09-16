import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          email: decoded.sub,
          role: decoded.role || "ROLE_CUSTOMER",
          userId: 1, // Fallback default demo user ID
        });
      } else {
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/api/users/login", { email, password });
    const jwtToken = response.data.token;
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    const decoded = parseJwt(jwtToken);
    const loggedUser = {
      email: response.data.email || (decoded ? decoded.sub : email),
      role: response.data.role || (decoded ? decoded.role : "ROLE_CUSTOMER"),
      userId: 1,
    };
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (formData) => {
    const response = await api.post("/api/users/register", formData);
    // After register, immediately log them in
    if (response.data && response.data.token) {
      const jwtToken = response.data.token;
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
    } else {
      await login(formData.email, formData.password);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
