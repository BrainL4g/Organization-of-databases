// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { mockUsers } from '../data/mockData';
// import { ROLES } from '../utils/roles';  // УДАЛИ ЭТУ СТРОКУ

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (login, password) => {
    const user = mockUsers.find(u => u.login === login && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPass } = user;
      setCurrentUser(userWithoutPass);
      localStorage.setItem('user', JSON.stringify(userWithoutPass));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const loadUser = () => {
    const saved = localStorage.getItem('user');
    if (saved) setCurrentUser(JSON.parse(saved));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};