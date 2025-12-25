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
      localStorage.setItem('user', JSON.stringify(userWithoutPass));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Слушатель для синхронизации между вкладками
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          setCurrentUser(JSON.parse(e.newValue));
        } else {
          setCurrentUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};