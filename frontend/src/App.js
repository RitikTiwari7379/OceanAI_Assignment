import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CreateProject from './components/CreateProject';
import ProjectEditor from './components/ProjectEditor';
import { Toaster } from './components/ui/sonner';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Global axios interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user automatically
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initialize auth state from sessionStorage and validate token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      
      if (storedToken) {
        // Validate token with server
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          // Validate token using dedicated endpoint
          const response = await axios.get(`${API}/auth/validate`);
          
          // If successful, token is valid
          setToken(storedToken);
          setUser({
            id: response.data.user_id,
            email: response.data.email
          });
        } catch (error) {
          // Token is invalid or server is down, clear auth
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          // Token validation failed, user needs to login again
        }
      }
      
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, []);

  const login = (token, userData) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };
  
  // SessionStorage naturally clears on browser close, so we don't need to manually handle it
  // Only clear session on explicit logout or token expiration (handled by interceptor)

  // Don't render routes until auth state is initialized
  if (!isInitialized) {
    return (
      <div className="App">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!token ? <Auth onLogin={login} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/create"
            element={token ? <CreateProject /> : <Navigate to="/auth" />}
          />
          <Route
            path="/project/:projectId"
            element={token ? <ProjectEditor /> : <Navigate to="/auth" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
