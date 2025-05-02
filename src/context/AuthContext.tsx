import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/types';
import { decodeToken } from "react-jwt";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, instrument: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('access_token');
    if (storedUser) {
      try {
        const decodedToken = decodeToken(storedUser) as User;
        console.log(decodedToken);
        
        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding stored user token:', error);
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    
    try {
      const decodedToken = decodeToken(data.access_token) as User;
      localStorage.setItem('access_token', data.access_token);
      setUser(decodedToken);
    } catch (error) {
      console.error('Error decoding login token:', error);
      throw new Error('Invalid token received from server');
    }
  };

  const register = async (username: string, password: string, instrument: string) => {
    const res = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, instrument }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    
    try {
      const decodedToken = decodeToken(data.access_token) as User;
      localStorage.setItem('access_token', data.access_token);
      setUser(decodedToken);
      localStorage.setItem('user', data.access_token);
    } catch (error) {
      console.error('Error decoding registration token:', error);
      throw new Error('Invalid token received from server');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 