import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('mindspace_user');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('mindspace_token', data.token);
    localStorage.setItem('mindspace_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, age) => {
    const { data } = await api.post('/auth/register', { name, email, password, age });
    localStorage.setItem('mindspace_token', data.token);
    localStorage.setItem('mindspace_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mindspace_token');
    localStorage.removeItem('mindspace_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('mindspace_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
