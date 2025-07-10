import React, { createContext, useContext } from 'react';

interface AuthContextType {
  signIn: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {
    // Dummy implementation for login
    return Promise.resolve();
  },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const signIn = async (username: string, password: string) => {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    // Optionally, handle token storage here
  };

  return (
    <AuthContext.Provider value={{ signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
