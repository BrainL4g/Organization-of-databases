// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (login, password) => {
    const hashedPass = CryptoJS.SHA256(password).toString();
    const user = mockUsers.find(u => u.login === login && u.password === hashedPass);
    if (user) {
      const { password: _, ...userWithoutPass } = user;
      setCurrentUser(userWithoutPass);
      sessionStorage.setItem('user', JSON.stringify(userWithoutPass));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('user');
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};