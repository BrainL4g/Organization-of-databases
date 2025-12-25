// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Добавили состояние загрузки

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

  // Автоматически загружаем пользователя при старте приложения
  useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem('user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
      setLoading(false); // Загрузка завершена
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};