import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

type Role = 'master_admin' | 'client_admin' | 'supplier_admin' | 'client_user' | 'supplier_user' | 'requestor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  lastLogin: {
    timestamp: string;
    ip: string;
  };
  status: 'active' | 'inactive' | 'pending';
}

interface AuthContextType {
  currentUser: User | null;
  isImpersonating: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  impersonateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage (would be JWT in production)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching email (in real app, would verify password hash)
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        // Update last login
        const userWithUpdatedLogin = {
          ...user,
          lastLogin: {
            timestamp: new Date().toISOString(),
            ip: '192.168.1.' + Math.floor(Math.random() * 255)
          }
        };
        
        setCurrentUser(userWithUpdatedLogin);
        localStorage.setItem('currentUser', JSON.stringify(userWithUpdatedLogin));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setOriginalUser(null);
    setIsImpersonating(false);
    localStorage.removeItem('currentUser');
  };

  const impersonateUser = (user: User) => {
    if (!isImpersonating) {
      setOriginalUser(currentUser);
    }
    
    setCurrentUser(user);
    setIsImpersonating(true);
  };

  const value = {
    currentUser,
    isImpersonating,
    login,
    logout,
    impersonateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};