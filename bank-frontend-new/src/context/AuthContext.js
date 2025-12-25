import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Мок-данные с тремя ролями
      const initialUsers = [
        {
          id: 1,
          login: 'testclient',
          email: 'testclient@example.com',
          fullName: 'Иванов Иван Иванович',
          password: 'password123',
          created_at: new Date().toISOString(),
          role: 'client',
          phone: '+7 (999) 123-45-67',
          address: 'г. Москва, ул. Примерная, д. 1'
        },
        {
          id: 2,
          login: 'testemployee',
          email: 'testemployee@example.com',
          fullName: 'Петрова Анна Сергеевна',
          password: 'password123',
          created_at: new Date().toISOString(),
          role: 'employee',
          position: 'Специалист по работе с клиентами',
          department: 'Отдел обслуживания',
          phone: '+7 (999) 234-56-78'
        },
        {
          id: 3,
          login: 'testadmin',
          email: 'testadmin@example.com',
          fullName: 'Сидоров Алексей Викторович',
          password: 'password123',
          created_at: new Date().toISOString(),
          role: 'admin',
          position: 'Администратор системы',
          department: 'IT-отдел'
        }
      ];
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const login = (loginVal, password) => {
    const foundUser = users.find(u => u.login === loginVal && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = (data, role = 'client') => {
    const { login, email, full_name, password } = data;
    if (users.some(u => u.login === login || u.email === email)) {
      return false;
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      login,
      email,
      fullName: full_name,
      password,
      created_at: new Date().toISOString(),
      role
    };
    setUsers([...users, newUser]);
    const { password: _, ...userWithoutPass } = newUser;
    setUser(userWithoutPass);
    setIsAuthenticated(true);
    return true;
  };

  const recoverAccess = (email) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      console.log(`Mock recovery: New password for ${foundUser.login} sent to ${email}`);
      return true;
    }
    return false;
  };

  const updateUserProfile = (userId, updates) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    
    if (user && user.id === userId) {
      setUser({ ...user, ...updates });
    }
  };

  const deleteUser = (userId) => {
    if (user && user.id === userId) {
      logout();
    }
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
  };

  const getAllUsers = () => {
    return users.map(({ password, ...userWithoutPass }) => userWithoutPass);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register, 
      recoverAccess,
      updateUserProfile,
      deleteUser,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
