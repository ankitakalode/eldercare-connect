import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('eldercare_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('eldercare_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await authAPI.login({ email, password });
      setUser(data);
      localStorage.setItem('eldercare_user', JSON.stringify(data));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const { data } = await authAPI.register(formData);
      setUser(data);
      localStorage.setItem('eldercare_user', JSON.stringify(data));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eldercare_user');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('eldercare_user', JSON.stringify(newUser));
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user?.token;

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, updateUser, isAdmin, isAuthenticated, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
