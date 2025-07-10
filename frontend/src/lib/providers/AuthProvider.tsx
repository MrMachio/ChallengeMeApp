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
    // Dummy sign-in logic (replace with real logic)
    if (username !== 'user' || password !== 'pass') {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <AuthContext.Provider value={{ signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
