// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL; 

// Attaches the saved token to every outgoing axios request, app-wide.
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    axios
      .get(`${API_BASE}/api/v1/auth/me`)
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // === NEW: THE MISSING REGISTER FUNCTION ===
  const register = async (userData) => {
    // Sends the user's registration data directly to the backend
    const response = await axios.post(`${API_BASE}/api/v1/auth/register`, userData);
    return response.data;
  };

  const login = async (credentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const loginResponse = await axios.post(`${API_BASE}/api/v1/auth/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = loginResponse.data;

    localStorage.setItem('token', access_token);
    
    // Explicitly attach the header here to bypass any interceptor delays!
    const meResponse = await axios.get(`${API_BASE}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    const userData = meResponse.data;

    setToken(access_token);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));

    return userData.role;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // === NEW: Added 'register' to the exported values so other files can use it! ===
  const value = { user, token, isAuthenticated, isLoading, login, logout, register };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};