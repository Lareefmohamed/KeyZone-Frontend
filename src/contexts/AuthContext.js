// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Set token in service
        userService.setAuthToken(token);
        const response = await userService.getProfile();
        
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clean up
          localStorage.removeItem('token');
          userService.removeAuthToken();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clean up invalid tokens
      localStorage.removeItem('token');
      userService.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await userService.login({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { user: userData, token } = response.data.data;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }

      // Store token and set up authentication
      localStorage.setItem('token', token);
      userService.setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      
      // Clean up on error
      localStorage.removeItem('token');
      userService.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      
      // Re-throw error with proper message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const register = async (userData) => {
    try {
      if (!userData.email || !userData.password || !userData.username) {
        throw new Error('Required fields are missing');
      }

      const response = await userService.register(userData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      return response;
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      
      // Re-throw error with proper message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      userService.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clean up even if there's an error
      localStorage.removeItem('token');
      userService.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!profileData) {
        throw new Error('Profile data is required');
      }

      const response = await userService.updateProfile(profileData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Profile update failed');
      }

      setUser(response.data.data);
      return response;
    } catch (error) {
      console.error('Profile update error in AuthContext:', error);
      
      // Re-throw error with proper message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Profile update failed. Please try again.');
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};