import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  email: string | null;
  setEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
  email: null,
  setEmail: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        email,
        setEmail,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 