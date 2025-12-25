import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (login, password) => {
    if (login && password) {
      setUser({
        id: 1,
        login: login,
        fullName: "Иванов Иван Иванович",
        email: "ivan@example.com"
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = (data) => {
    setUser({
      id: 1,
      login: data.login,
      fullName: data.full_name,
      email: data.email
    });
    setIsAuthenticated(true);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};