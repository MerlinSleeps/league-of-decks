"use client"; // This is a client-side utility

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Our client-side auth instance
import React from 'react';

// Define the shape of our context
interface AuthContextType {
  user: User | null; // The Firebase user object
  isLoading: boolean; // True while we're checking for a user
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the "Provider" component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user (or null)
      setIsLoading(false); // We're done loading
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children} {/* Don't render children until we know the auth state */}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};